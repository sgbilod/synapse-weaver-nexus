/**
 * DetailView - The Inspection Panel
 * 
 * Placeholder for future detailed views of selected tasks, agents, or plans.
 */

import React from 'react';
import './DetailView.css';

export const DetailView: React.FC = () => {
  return (
    <div className="detail-view">
      <h2 className="panel-header">🔍 Detail View</h2>

      <div className="detail-placeholder">
        <div className="placeholder-icon">🔮</div>
        <h3>Detail View</h3>
        <p>
          This panel will display detailed information about selected items:
        </p>
        <ul>
          <li>Task execution details</li>
          <li>Agent performance metrics</li>
          <li>Plan breakdown and analysis</li>
          <li>Receipt inspection</li>
        </ul>
        <div className="placeholder-badge">Coming in v2</div>
      </div>
    </div>
  );
};
