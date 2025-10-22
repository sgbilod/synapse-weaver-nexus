#!/usr/bin/env ts-node
/**
 * Generic Gemini V1 Agent
 *
 * An intelligent agent powered by Google's Gemini API.
 * Accepts natural language prompts and generates code responses.
 *
 * Environment Variables:
 *   GEMINI_API_KEY - Required API key for Google Generative AI
 *   TASK_DESCRIPTION - Task passed from orchestration engine (optional, can use argv)
 *
 * Output Format:
 *   JSON object: { "code": "generated code here" }
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../../logger";

interface AgentResponse {
  code: string;
}

async function main(): Promise<void> {
  try {
    // Step 1: Validate API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      process.stdout.write(
        JSON.stringify({
          error:
            "FATAL: GEMINI_API_KEY environment variable is not set or empty.",
          code: "",
        }) + "\n"
      );
      process.exit(1);
    }

    // Step 2: Get the task description
    const taskDescription =
      process.env.TASK_DESCRIPTION || process.argv[2] || "";

    if (!taskDescription || taskDescription.trim() === "") {
      process.stdout.write(
        JSON.stringify({
          error:
            "FATAL: No task description provided. Pass as command-line argument or TASK_DESCRIPTION env var.",
          code: "",
        }) + "\n"
      );
      process.exit(1);
    }

    // Step 3: Initialize Gemini AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Step 4: Craft the prompt for code generation
    const prompt = `You are an expert code generation assistant. Generate clean, well-commented code based on this request:

${taskDescription}

Return ONLY the code itself, without any markdown formatting, explanations, or surrounding text. The code should be production-ready and follow best practices.`;

    // Step 5: Call Gemini API
    logger.info(`Sending request to Gemini API...`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedCode = response.text();

    // Step 6: Clean the response (remove markdown code blocks if present)
    let cleanedCode = generatedCode.trim();

    // Remove markdown code fences if present
    const codeBlockPattern = /^```[\w]*\n([\s\S]*)\n```$/;
    const match = cleanedCode.match(codeBlockPattern);
    if (match) {
      cleanedCode = match[1].trim();
    }

    // Step 7: Output JSON to stdout
    const output: AgentResponse = {
      code: cleanedCode,
    };
    // Emit result as raw JSON for consumers
    process.stdout.write(JSON.stringify(output) + "\n");
    logger.info(`Code generation completed successfully.`);
  } catch (error) {
    // Step 8: Handle errors gracefully
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error(`ERROR: ${errorMessage}`);

    // Still output valid JSON on error
    process.stdout.write(
      JSON.stringify({
        error: `Failed to generate code: ${errorMessage}`,
        code: "",
      }) + "\n"
    );

    process.exit(1);
  }
}

// Execute the agent
main().catch((error) => {
  logger.error(`Unhandled error: ${error}`);
  process.exit(1);
});
