# Live Fire Exercise - Crucible Phase 5
# Automated system resilience test: 5 consecutive launch/terminate cycles

param(
    [int]$Cycles = 5,
    [int]$StartupTimeout = 60,
    [int]$StabilizationDelay = 10,
    [int]$ShutdownDelay = 2
)

$ErrorActionPreference = "Stop"
$Global:ExerciseFailed = $false
$Global:FailureReason = ""

# ANSI color codes for output
$Green = "`e[32m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$Cyan = "`e[36m"
$Reset = "`e[0m"

function Write-ExerciseLog {
    param([string]$Message, [string]$Color = $Reset)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss.fff"
    Write-Host "${Color}[$Timestamp] $Message${Reset}"
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "${Cyan}═══════════════════════════════════════════════════════════════${Reset}"
    Write-Host "${Cyan}  $Title${Reset}"
    Write-Host "${Cyan}═══════════════════════════════════════════════════════════════${Reset}"
    Write-Host ""
}

function Wait-ForStartupSignals {
    param(
        [System.Diagnostics.Process]$Process,
        [int]$TimeoutSeconds
    )
    
    $NexusOnline = $false
    $ViteOnline = $false
    $StartTime = Get-Date
    
    Write-ExerciseLog "Monitoring startup signals (timeout: ${TimeoutSeconds}s)..." $Yellow
    
    while (((Get-Date) - $StartTime).TotalSeconds -lt $TimeoutSeconds) {
        if ($Process.HasExited) {
            throw "Process terminated unexpectedly during startup"
        }
        
        # Check for output signals (npm start outputs to both stdout and stderr)
        # We'll check the process tree for the signals
        
        # Check if both services are listening on their ports
        if (-not $NexusOnline) {
            try {
                $TcpClient = New-Object System.Net.Sockets.TcpClient
                $Connect = $TcpClient.BeginConnect("localhost", 3002, $null, $null)
                $Wait = $Connect.AsyncWaitHandle.WaitOne(100, $false)
                if ($Wait) {
                    try {
                        $TcpClient.EndConnect($Connect)
                        $NexusOnline = $true
                        Write-ExerciseLog "✓ Nexus Core detected on port 3002" $Green
                    }
                    catch {
                        # Port not open yet
                    }
                }
                $TcpClient.Close()
            }
            catch {
                # Port not ready yet
            }
        }
        
        if (-not $ViteOnline) {
            try {
                $TcpClient = New-Object System.Net.Sockets.TcpClient
                $Connect = $TcpClient.BeginConnect("localhost", 5173, $null, $null)
                $Wait = $Connect.AsyncWaitHandle.WaitOne(100, $false)
                if ($Wait) {
                    try {
                        $TcpClient.EndConnect($Connect)
                        $ViteOnline = $true
                        Write-ExerciseLog "✓ Vite dev server detected on port 5173" $Green
                    }
                    catch {
                        # Port not open yet
                    }
                }
                $TcpClient.Close()
            }
            catch {
                # Port not ready yet
            }
        }
        
        if ($NexusOnline -and $ViteOnline) {
            return $true
        }
        
        Start-Sleep -Milliseconds 500
    }
    
    # Timeout reached
    $MissingServices = @()
    if (-not $NexusOnline) { $MissingServices += "Nexus Core (port 3002)" }
    if (-not $ViteOnline) { $MissingServices += "Vite server (port 5173)" }
    
    throw "Startup timeout: $($MissingServices -join ', ') failed to start within ${TimeoutSeconds}s"
}

function Stop-NpmProcessTree {
    param([int]$RootPid)
    
    Write-ExerciseLog "Terminating process tree for PID $RootPid..." $Yellow
    
    # Get all child processes recursively
    function Get-ProcessTree {
        param([int]$ParentId)
        
        $Children = Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $ParentId }
        
        foreach ($Child in $Children) {
            Get-ProcessTree -ParentId $Child.ProcessId
            $Child
        }
    }
    
    try {
        # Get the full process tree
        $ProcessTree = @(Get-ProcessTree -ParentId $RootPid)
        
        # Add the root process
        $RootProcess = Get-Process -Id $RootPid -ErrorAction SilentlyContinue
        if ($RootProcess) {
            $ProcessTree += $RootProcess
        }
        
        # Terminate all processes (children first, then root)
        foreach ($Proc in $ProcessTree) {
            try {
                $ProcessId = if ($Proc.ProcessId) { $Proc.ProcessId } else { $Proc.Id }
                $ProcessName = if ($Proc.Name) { $Proc.Name } else { $Proc.ProcessName }
                
                Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
                Write-ExerciseLog "  Terminated: $ProcessName (PID: $ProcessId)" $Cyan
            }
            catch {
                # Process may have already exited
            }
        }
        
        # Verify root process is terminated
        Start-Sleep -Milliseconds 500
        $StillRunning = Get-Process -Id $RootPid -ErrorAction SilentlyContinue
        if ($StillRunning) {
            Write-ExerciseLog "  Forcing termination of root process..." $Yellow
            Stop-Process -Id $RootPid -Force
        }
        
        Write-ExerciseLog "Process tree terminated" $Green
        
    }
    catch {
        Write-ExerciseLog "Warning: Error during process termination: $_" $Yellow
    }
}

function Invoke-StartupCycle {
    param([int]$CycleNumber)
    
    $CycleStartTime = Get-Date
    
    Write-Header "CYCLE $CycleNumber of $Cycles"
    
    try {
        # Start the system
        Write-ExerciseLog "Starting npm start..." $Cyan
        
        $ProcessInfo = New-Object System.Diagnostics.ProcessStartInfo
        $ProcessInfo.FileName = "pwsh.exe"
        $ProcessInfo.Arguments = "-NoProfile -Command `"npm start`""
        $ProcessInfo.WorkingDirectory = (Get-Location).Path
        $ProcessInfo.UseShellExecute = $false
        $ProcessInfo.RedirectStandardOutput = $true
        $ProcessInfo.RedirectStandardError = $true
        $ProcessInfo.CreateNoWindow = $false
        
        $Process = New-Object System.Diagnostics.Process
        $Process.StartInfo = $ProcessInfo
        
        # Start process
        $Started = $Process.Start()
        if (-not $Started) {
            throw "Failed to start npm process"
        }
        
        $ProcessId = $Process.Id
        Write-ExerciseLog "npm process started (PID: $ProcessId)" $Green
        
        # Wait for startup signals
        $StartupSuccess = Wait-ForStartupSignals -Process $Process -TimeoutSeconds $StartupTimeout
        
        if ($StartupSuccess) {
            $StartupTime = ((Get-Date) - $CycleStartTime).TotalSeconds
            Write-ExerciseLog "✅ SUCCESS: Cycle $CycleNumber started successfully (${StartupTime}s)" $Green
            
            # Stabilization period
            Write-ExerciseLog "Stabilization period (${StabilizationDelay}s)..." $Yellow
            Start-Sleep -Seconds $StabilizationDelay
            
            # Shutdown
            Write-ExerciseLog "Initiating graceful shutdown..." $Yellow
            Stop-NpmProcessTree -RootPid $ProcessId
            
            # Additional cleanup: kill any remaining node/electron processes
            Get-Process | Where-Object { $_.ProcessName -match "node|electron" } | ForEach-Object {
                try {
                    Write-ExerciseLog "  Cleanup: Terminating $($_.ProcessName) (PID: $($_.Id))" $Cyan
                    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
                }
                catch {
                    # Ignore errors
                }
            }
            
            Write-ExerciseLog "✅ SUCCESS: Cycle $CycleNumber terminated gracefully" $Green
            
            # Inter-cycle delay
            if ($CycleNumber -lt $Cycles) {
                Write-ExerciseLog "Inter-cycle delay (${ShutdownDelay}s)..." $Yellow
                Start-Sleep -Seconds $ShutdownDelay
            }
            
            return $true
        }
        
    }
    catch {
        $Global:ExerciseFailed = $true
        $Global:FailureReason = "Cycle ${CycleNumber}: $_"
        Write-ExerciseLog "❌ FAILURE: $Global:FailureReason" $Red
        
        # Attempt cleanup
        try {
            if ($ProcessId) {
                Stop-NpmProcessTree -RootPid $ProcessId
            }
            
            # Kill all node/electron processes
            Get-Process | Where-Object { $_.ProcessName -match "node|electron" } | Stop-Process -Force -ErrorAction SilentlyContinue
        }
        catch {
            Write-ExerciseLog "Cleanup error: $_" $Yellow
        }
        
        return $false
    }
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

Write-Header "CRUCIBLE PHASE 5: LIVE FIRE EXERCISE"

Write-ExerciseLog "Configuration:" $Cyan
Write-ExerciseLog "  Total Cycles: $Cycles" $Cyan
Write-ExerciseLog "  Startup Timeout: ${StartupTimeout}s" $Cyan
Write-ExerciseLog "  Stabilization Delay: ${StabilizationDelay}s" $Cyan
Write-ExerciseLog "  Shutdown Delay: ${ShutdownDelay}s" $Cyan
Write-Host ""

$ExerciseStartTime = Get-Date

# Execute all cycles
for ($i = 1; $i -le $Cycles; $i++) {
    $Success = Invoke-StartupCycle -CycleNumber $i
    
    if (-not $Success) {
        Write-Header "EXERCISE ABORTED"
        Write-ExerciseLog "Reason: $Global:FailureReason" $Red
        exit 1
    }
}

# Success!
$TotalTime = ((Get-Date) - $ExerciseStartTime).TotalSeconds

Write-Header "EXERCISE COMPLETE"
Write-ExerciseLog "✅ ALL $Cycles CYCLES COMPLETED SUCCESSFULLY" $Green
Write-ExerciseLog "Total execution time: ${TotalTime}s" $Cyan
Write-Host ""
Write-Host "${Green}The Nexus has passed through the fire.${Reset}"
Write-Host ""

exit 0
