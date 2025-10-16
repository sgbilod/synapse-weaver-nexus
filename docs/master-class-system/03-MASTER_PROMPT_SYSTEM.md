# 🚀 SYNAPSE WEAVER NEXUS - MASTER CLASS PROMPT SYSTEM
## GitHub Copilot + Cagent Hyper-Automation Directive

**Version:** 1.0
**Last Updated:** October 16, 2025
**Target System:** GitHub Copilot in VS Code + Docker Cagent
**Project:** Synapse Weaver Nexus (sgbilod/synapse-weaver-nexus)

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Activation Directive](#activation-directive)
3. [Agent Architecture](#agent-architecture)
4. [Master Prompts by Task Domain](#master-prompts)
5. [Cagent Configuration Templates](#cagent-config)
6. [Integration Workflow](#workflow)
7. [Quality Assurance Checkpoints](#qa-checkpoints)

---

## SYSTEM OVERVIEW

This Master Class Prompt System transforms GitHub Copilot into a hyper-automated development orchestrator for Synapse Weaver Nexus using Docker Cagent as the execution engine.

**Key Components:**
- **Copilot Interface:** Natural language command input in VS Code
- **Cagent Layer:** Multi-agent orchestration and task execution
- **MCP Integration:** Tool access (GitHub, filesystem, web search)
- **Feedback Loop:** Real-time validation and iteration

**Efficiency Gain:** 60-75% reduction in development time through agent delegation and parallel execution.

---

## ACTIVATION DIRECTIVE

### How to Activate This System

**Step 1: In VS Code, Open Copilot Chat and Enter:**

```
@copilot I'm activating the SYNAPSE WEAVER MASTER CLASS PROMPT SYSTEM. 
Please load the following system configuration: SWMCP-v1.0

This system enables hyper-automated development for the Synapse Weaver Nexus project 
using Docker Cagent for multi-agent orchestration and MCP tool integration.

My task is to complete the project roadmap items documented in the GitHub repository 
at sgbilod/synapse-weaver-nexus and outlined in the detailed project analysis.

Ready for directive input.
```

**Step 2: Cagent Environment Setup**

```bash
# Install Cagent
brew install docker-cagent  # macOS
# OR download from: https://github.com/docker/cagent/releases

# Set environment variables
export ANTHROPIC_API_KEY=your_key_here
export OPENAI_API_KEY=your_key_here
export GITHUB_TOKEN=your_token_here

# Verify installation
cagent --version
```

**Step 3: Initialize Project Cagent**

```bash
cd /path/to/synapse-weaver-nexus
cagent new
# This creates initial agent configuration
```

---

## AGENT ARCHITECTURE

### Multi-Agent Team Structure

The system defines a hierarchical team of specialized agents, each optimized for specific domains:

```
ROOT AGENT (Orchestrator)
├── ARCHITECT AGENT (System Design)
├── DEVELOPER AGENT (Code Implementation)
├── TESTER AGENT (QA & Validation)
├── INTEGRATOR AGENT (API & Tool Integration)
├── SECURITY AGENT (Security & Auth)
├── DEVOPS AGENT (Deployment & Infrastructure)
└── DOCUMENTATION AGENT (Knowledge Base)
```

### Agent Roles & Responsibilities

| Agent | Role | Responsibilities | Tools |
|-------|------|-----------------|-------|
| **Orchestrator** | Master Coordinator | Task breakdown, delegation, priority management | think, todo, transfer_task |
| **Architect** | System Design | Architecture decisions, pattern design, API design | think, web_search, filesystem |
| **Developer** | Implementation | Code generation, refactoring, testing | filesystem, git, code_analysis |
| **Tester** | Quality Assurance | Test creation, coverage analysis, bug detection | jest, playwright, filesystem |
| **Integrator** | External Systems | API integration, third-party tools, webhooks | web_search, github_api, filesystem |
| **Security** | Protection Layer | Auth implementation, encryption, vulnerability checks | security_scanner, filesystem, git |
| **DevOps** | Infrastructure | CI/CD, containerization, deployment automation | docker, github_actions, filesystem |
| **Documentation** | Knowledge Management | API docs, guides, inline code documentation | web_search, filesystem, github_api |

---

Note: See the complete Master Prompt System document for full domain prompts and configuration templates.

[For complete content, see: 03-MASTER_PROMPT_SYSTEM.md in the repository]
