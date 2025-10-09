// packages/nexus-core/src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { OrchestrationEngine } from "./OrchestrationEngine.js";

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

const nexusEngine = new OrchestrationEngine();
console.log("[Nexus Server] Orchestration Engine Initialized.");

app.post("/task", async (req: Request, res: Response) => {
  try {
    const { taskVector, projectRootPath } = req.body;
    if (!taskVector || !projectRootPath) {
      return res
        .status(400)
        .json({ error: "Missing taskVector or projectRootPath" });
    }

    console.log(`[Nexus Server] Received task: ${taskVector.id}`);
    const receipt = await nexusEngine.receiveTask(taskVector, projectRootPath);
    res.json(receipt);
  } catch (error) {
    console.error(
      "[Nexus Server] A fatal error occurred during task execution:",
      error
    );
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({
        error: "Nexus Core failed to execute task.",
        details: errorMessage,
      });
  }
});

app.listen(port, () => {
  console.log(
    `[Nexus Server] Synapse Weaver Nexus Core is online and listening on http://localhost:${port}`
  );
});
