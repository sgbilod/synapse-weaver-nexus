/**
 * E2E Test for Command Deck
 * 
 * Tests the Electron application's main window, UI visibility,
 * and connection to the Nexus Core.
 */

import { test, expect } from '@playwright/test';
import { _electron as electron } from 'playwright';
import path from 'path';

test.describe('Command Deck E2E', () => {
  test('should launch Electron app and display Command Deck UI', async () => {
    // Launch Electron app
    const electronApp = await electron.launch({
      args: [path.join(__dirname, '../dist-electron/main.js')],
      timeout: 30000
    });

    // Wait for the main window to be created
    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Verify window is visible
    expect(await window.isVisible()).toBe(true);

    // Verify title
    const title = await window.title();
    expect(title).toContain('Synapse Weaver Nexus');

    // Verify main UI elements are present
    const appContainer = await window.locator('.app-container');
    await expect(appContainer).toBeVisible();

    // Verify header
    const header = await window.locator('.app-header');
    await expect(header).toBeVisible();
    await expect(header).toContainText('SYNAPSE WEAVER NEXUS');

    // Verify three panels
    const stateMonitor = await window.locator('.state-monitor');
    await expect(stateMonitor).toBeVisible();
    await expect(stateMonitor).toContainText('State Monitor');

    const taskFeed = await window.locator('.task-feed');
    await expect(taskFeed).toBeVisible();
    await expect(taskFeed).toContainText('Task Feed');

    const detailView = await window.locator('.detail-view');
    await expect(detailView).toBeVisible();
    await expect(detailView).toContainText('Detail View');

    // Verify Personal En-gram section
    const enclaveSection = await window.locator('.enclave-section');
    await expect(enclaveSection).toBeVisible();
    await expect(enclaveSection).toContainText('Personal En-gram');
    await expect(enclaveSection).toContainText('Indentation');
    await expect(enclaveSection).toContainText('Quote Style');

    // Verify initial state shows "unknown" for indentation and quote style
    const enclaveItems = await window.locator('.enclave-item');
    const count = await enclaveItems.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Verify Agent Credibility Ledger section
    const ledgerSection = await window.locator('.ledger-section');
    await expect(ledgerSection).toBeVisible();
    await expect(ledgerSection).toContainText('Agent Credibility Ledger');

    // Verify connection status
    const connectionStatus = await window.locator('.connection-status');
    await expect(connectionStatus).toBeVisible();
    await expect(connectionStatus).toContainText('Nexus Core Online');

    // Verify status indicator is present
    const statusIndicator = await window.locator('.status-indicator.connected');
    await expect(statusIndicator).toBeVisible();

    // Close the app
    await electronApp.close();
  });

  test('should display initial state correctly', async () => {
    // Launch Electron app
    const electronApp = await electron.launch({
      args: [path.join(__dirname, '../dist-electron/main.js')],
      timeout: 30000
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Wait for state to load
    await window.waitForSelector('.state-monitor', { state: 'visible', timeout: 5000 });

    // Check that indentation and quote style show as "unknown" initially
    const enclaveValues = await window.locator('.enclave-value');
    const enclaveTexts = await enclaveValues.allTextContents();
    
    expect(enclaveTexts).toContain('unknown');

    // Verify Task Feed shows initial event
    const taskFeed = await window.locator('.task-feed');
    await expect(taskFeed).toBeVisible();

    // The feed might have events or be empty initially
    const feedContainer = await window.locator('.feed-container');
    await expect(feedContainer).toBeVisible();

    await electronApp.close();
  });
});
