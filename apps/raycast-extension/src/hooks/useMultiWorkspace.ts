import { useState, useEffect } from "react";
import { showToast, Toast } from "@raycast/api";
import { LinearClient, Issue } from "@linear/sdk";
import { Workspace, WorkspaceStorage } from "../workspace-storage";

export interface WorkspaceIssue {
  issue: Issue;
  workspace: Workspace;
}

export function useMultiWorkspace() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Map<string, LinearClient>>(new Map());

  useEffect(() => {
    loadWorkspaces();
  }, []);

  async function loadWorkspaces() {
    try {
      const stored = await WorkspaceStorage.getWorkspaces();
      setWorkspaces(stored);
      
      // Create Linear clients for each workspace
      const clientMap = new Map<string, LinearClient>();
      stored.forEach(workspace => {
        clientMap.set(workspace.id, new LinearClient({ accessToken: workspace.accessToken }));
      });
      setClients(clientMap);
    } catch (error) {
      console.error("Error loading workspaces:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to load workspaces",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function searchAllWorkspaces(query: string): Promise<WorkspaceIssue[]> {
    if (!query.trim() || workspaces.length === 0) return [];

    // Process workspaces in batches to avoid rate limits
    const batchSize = 2; // Search 2 workspaces at a time
    const results: WorkspaceIssue[] = [];
    
    for (let i = 0; i < workspaces.length; i += batchSize) {
      const batch = workspaces.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (workspace) => {
        const client = clients.get(workspace.id);
        if (!client) return [];

        try {
          const searchResults = await client.searchIssues(query, { first: 20 }); // Limit results per workspace
          return searchResults.nodes.map(issue => ({ issue, workspace }));
        } catch (error) {
          console.error(`Search failed for workspace ${workspace.name}:`, error);
          // Check if it's a rate limit error
          if (error instanceof Error && error.message.includes('rate limit')) {
            showToast({
              style: Toast.Style.Failure,
              title: "Rate limit reached",
              message: `Slowing down searches for ${workspace.name}`,
            });
          }
          return [];
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.flat());
      
      // Add a small delay between batches to avoid rate limits
      if (i + batchSize < workspaces.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  async function getRecentIssues(limit = 50): Promise<WorkspaceIssue[]> {
    if (workspaces.length === 0) return [];

    // Limit issues per workspace to avoid hitting rate limits
    const issuesPerWorkspace = Math.min(10, Math.ceil(limit / workspaces.length));
    const results: WorkspaceIssue[] = [];

    // Process workspaces sequentially to avoid rate limits
    for (const workspace of workspaces) {
      const client = clients.get(workspace.id);
      if (!client) continue;

      try {
        const issues = await client.issues({
          first: issuesPerWorkspace,
          orderBy: "updatedAt",
        });
        results.push(...issues.nodes.map(issue => ({ issue, workspace })));
        
        // Small delay between workspace queries
        if (workspaces.indexOf(workspace) < workspaces.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } catch (error) {
        console.error(`Failed to load issues for workspace ${workspace.name}:`, error);
      }
    }
    
    // Sort by updated date across all workspaces
    return results
      .sort((a, b) => new Date(b.issue.updatedAt).getTime() - new Date(a.issue.updatedAt).getTime())
      .slice(0, limit);
  }

  function getClient(workspaceId: string): LinearClient | undefined {
    return clients.get(workspaceId);
  }

  return {
    workspaces,
    isLoading,
    searchAllWorkspaces,
    getRecentIssues,
    getClient,
    reloadWorkspaces: loadWorkspaces,
  };
}