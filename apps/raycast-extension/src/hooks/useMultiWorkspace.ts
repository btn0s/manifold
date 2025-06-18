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

    const searchPromises = workspaces.map(async (workspace) => {
      const client = clients.get(workspace.id);
      if (!client) return [];

      try {
        const results = await client.searchIssues(query);
        return results.nodes.map(issue => ({ issue, workspace }));
      } catch (error) {
        console.error(`Search failed for workspace ${workspace.name}:`, error);
        return [];
      }
    });

    const results = await Promise.all(searchPromises);
    return results.flat();
  }

  async function getRecentIssues(limit = 50): Promise<WorkspaceIssue[]> {
    if (workspaces.length === 0) return [];

    const issuePromises = workspaces.map(async (workspace) => {
      const client = clients.get(workspace.id);
      if (!client) return [];

      try {
        const issues = await client.issues({
          first: Math.ceil(limit / workspaces.length),
          orderBy: "updatedAt",
        });
        return issues.nodes.map(issue => ({ issue, workspace }));
      } catch (error) {
        console.error(`Failed to load issues for workspace ${workspace.name}:`, error);
        return [];
      }
    });

    const results = await Promise.all(issuePromises);
    const allIssues = results.flat();
    
    // Sort by updated date across all workspaces
    return allIssues
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