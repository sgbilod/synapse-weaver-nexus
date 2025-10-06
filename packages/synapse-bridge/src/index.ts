// Export VS Code extension entry points
export { activate, deactivate } from "./extension";

// Export intent parsing utilities
export { parseIntent } from "./intentParser";
export type { ParsedIntent } from "./intentParser";

// Legacy exports (to be refactored)
export interface BridgeCommand {
  id: string;
  payload: Record<string, unknown>;
}

export const forwardCommand = (command: BridgeCommand): string => {
  return `Command ${command.id} dispatched`;
};
