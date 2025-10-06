export interface AgentTemplate {
  name: string;
  capabilities: string[];
}

export const createTemplate = (template: AgentTemplate): AgentTemplate => {
  return { ...template };
};
