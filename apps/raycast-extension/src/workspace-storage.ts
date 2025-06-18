import { LocalStorage } from "@raycast/api";
import { LinearClient } from "@linear/sdk";

export interface Workspace {
  id: string;
  name: string;
  alias?: string;
  accessToken: string;
  organizationId: string;
  email: string;
  color?: string; // For visual distinction
}

const WORKSPACES_KEY = "manifold-workspaces";
const ACTIVE_WORKSPACE_KEY = "manifold-active-workspace";

export class WorkspaceStorage {
  static async getWorkspaces(): Promise<Workspace[]> {
    const data = await LocalStorage.getItem<string>(WORKSPACES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static async saveWorkspaces(workspaces: Workspace[]): Promise<void> {
    await LocalStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
  }

  static async addWorkspace(workspace: Workspace): Promise<void> {
    const workspaces = await this.getWorkspaces();
    
    // Check if workspace already exists
    const existingIndex = workspaces.findIndex(w => w.organizationId === workspace.organizationId);
    if (existingIndex >= 0) {
      // Update existing workspace
      workspaces[existingIndex] = workspace;
    } else {
      // Add new workspace
      workspaces.push(workspace);
    }
    
    await this.saveWorkspaces(workspaces);
  }

  static async removeWorkspace(id: string): Promise<void> {
    const workspaces = await this.getWorkspaces();
    const filtered = workspaces.filter(w => w.id !== id);
    await this.saveWorkspaces(filtered);
  }

  static async getWorkspaceByAlias(alias: string): Promise<Workspace | null> {
    const workspaces = await this.getWorkspaces();
    return workspaces.find(w => w.alias?.toLowerCase() === alias.toLowerCase()) || null;
  }

  static async getWorkspaceById(id: string): Promise<Workspace | null> {
    const workspaces = await this.getWorkspaces();
    return workspaces.find(w => w.id === id) || null;
  }

  static async updateWorkspaceAlias(id: string, alias: string): Promise<void> {
    const workspaces = await this.getWorkspaces();
    const workspace = workspaces.find(w => w.id === id);
    if (workspace) {
      workspace.alias = alias;
      await this.saveWorkspaces(workspaces);
    }
  }

  static async fetchWorkspaceInfo(accessToken: string): Promise<{
    organizationId: string;
    organizationName: string;
    email: string;
  }> {
    const client = new LinearClient({ accessToken });
    const viewer = await client.viewer;
    const organization = await viewer.organization;
    
    if (!organization) {
      throw new Error("No organization found for this access token");
    }

    return {
      organizationId: organization.id,
      organizationName: organization.name,
      email: viewer.email || "unknown",
    };
  }
}