import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { LinearClient } from "@linear/sdk";
import { z } from "zod";

// Schema for workspace configuration
const WorkspaceConfig = z.object({
  name: z.string(),
  apiKey: z.string(),
});

const Config = z.object({
  workspaces: z.array(WorkspaceConfig),
});

type Config = z.infer<typeof Config>;

class ManifoldMCPServer {
  private server: Server;
  private workspaces: Map<string, LinearClient> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: "manifold-linear",
        version: "0.0.1",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // TODO: Implement tool handlers for Linear operations
    // - list_issues
    // - create_issue
    // - update_issue
    // - search_issues
    // - list_workspaces
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Manifold MCP server running");
  }
}

const server = new ManifoldMCPServer();
server.run().catch(console.error);