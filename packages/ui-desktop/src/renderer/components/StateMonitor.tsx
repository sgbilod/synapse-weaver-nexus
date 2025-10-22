/**
 * StateMonitor - The Observer Panel
 *
 * Displays the Nexus's learned personality (PersonalEnclave) and
 * the credibility scores of all known agents.
 */

import React from "react";
import type { NexusState } from "../../preload.cjs";
import "./StateMonitor.css";

interface StateMonitorProps {
  personalEnclave: NexusState["personalEnclave"];
  agentCredibilityLedger: NexusState["agentCredibilityLedger"];
}

export const StateMonitor: React.FC<StateMonitorProps> = ({
  personalEnclave,
  agentCredibilityLedger,
}) => {
  const agentEntries = Object.entries(agentCredibilityLedger);

  return (
    <div className="state-monitor">
      <h2 className="panel-header">⚙️ State Monitor</h2>

      {/* Personal En-gram Section */}
      <section className="enclave-section">
        <h3 className="section-title">🧠 Personal En-gram</h3>
        <div className="enclave-grid">
          <div className="enclave-item">
            <span className="enclave-label">Indentation:</span>
            <span className={`enclave-value ${personalEnclave.indentation}`}>
              {personalEnclave.indentation}
            </span>
          </div>
          <div className="enclave-item">
            <span className="enclave-label">Quote Style:</span>
            <span className={`enclave-value ${personalEnclave.quoteStyle}`}>
              {personalEnclave.quoteStyle}
            </span>
          </div>
          <div className="enclave-item full-width">
            <span className="enclave-label">Preferred Libraries:</span>
            <span className="enclave-value">
              {personalEnclave.preferredLibraries.length > 0
                ? personalEnclave.preferredLibraries.join(", ")
                : "None learned yet"}
            </span>
          </div>
        </div>
      </section>

      {/* Agent Credibility Ledger Section */}
      <section className="ledger-section">
        <h3 className="section-title">🤖 Agent Credibility Ledger</h3>
        {agentEntries.length === 0 ? (
          <p className="empty-state">No agents tracked yet</p>
        ) : (
          <div className="agent-list">
            {agentEntries.map(([agentId, credibility]: [string, number]) => {
              // Default to 50% if credibility is NaN or invalid
              const safeCredibility =
                isNaN(credibility) ||
                credibility === null ||
                credibility === undefined
                  ? 0.5
                  : credibility;
              const percentage = Math.round(safeCredibility * 100);

              return (
                <div key={agentId} className="agent-item">
                  <div className="agent-info">
                    <span className="agent-id">{agentId}</span>
                    <span className="agent-credibility">{percentage}%</span>
                  </div>
                  <div className="credibility-bar">
                    <div
                      className={`credibility-fill ${getCredibilityClass(
                        safeCredibility
                      )} ${getWidthClass(percentage)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

/**
 * Get color based on credibility score
 */
function getCredibilityClass(credibility: number): string {
  if (credibility >= 0.8) return "credibility-green";
  if (credibility >= 0.6) return "credibility-blue";
  if (credibility >= 0.4) return "credibility-orange";
  return "credibility-red";
}

function getWidthClass(percentage: number): string {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  // Round to nearest 5% to limit class set
  const rounded = Math.round(clamped / 5) * 5;
  return `w-${rounded}`;
}
