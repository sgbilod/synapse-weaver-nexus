// packages/nexus-core/src/mock.agents.ts
import { AgentProfile } from "./cognitive.types";

export const AGENT_PROFILES: Record<string, AgentProfile> = {
  SENTINEL_JEST_TS: {
    id: "sentinel-jest-ts-v1",
    archetype: "Sentinel",
    specializations: ["Jest", "TypeScript", "Unit Testing"],
    costPerToken: 0.0001,
    costPerSecond: 0.05,
  },
  ALCHEMIST_TS_REFACTOR: {
    id: "alchemist-ts-refactor-v1",
    archetype: "Alchemist",
    specializations: ["TypeScript", "Code Refactoring", "Best Practices"],
    costPerToken: 0.00015,
    costPerSecond: 0.07,
  },
  SCOUT_NPM_VULNERABILITY: {
    id: "scout-npm-vuln-v1",
    archetype: "Scout",
    specializations: ["NPM", "Dependency Analysis", "Security"],
    costPerToken: 0.00008,
    costPerSecond: 0.04,
  },
  DRONE_GENERIC_TASK: {
    id: "drone-generic-v1",
    archetype: "Drone",
    specializations: ["Generic Task Execution", "File I/O"],
    costPerToken: 0.00005,
    costPerSecond: 0.03,
  },
};
