export interface BridgeCommand {
  id: string;
  payload: Record<string, unknown>;
}

export const forwardCommand = (command: BridgeCommand): string => {
  return `Command ${command.id} dispatched`;
};
