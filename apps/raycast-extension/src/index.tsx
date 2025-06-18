import { showToast, Toast, LaunchProps, closeMainWindow, open } from "@raycast/api";
import { LinearClient } from "@linear/sdk";
import { WorkspaceStorage } from "./workspace-storage";

interface CreateArguments {
  workspace: string;
  project?: string;
  title: string;
  description?: string;
}

export default async function CreateIssue(props: LaunchProps<{ arguments: CreateArguments }>) {
  const { workspace: workspaceQuery, project: projectQuery, title, description } = props.arguments;
  
  try {
    await showToast({
      style: Toast.Style.Animated,
      title: "Creating issue...",
    });

    // Load workspaces
    const workspaces = await WorkspaceStorage.getWorkspaces();
    
    if (workspaces.length === 0) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No workspaces",
        message: "Add a workspace first using 'Add Linear Workspace' command",
      });
      return;
    }

    // Find matching workspace
    const workspaceQueryLower = workspaceQuery.toLowerCase();
    const workspace = workspaces.find(w => 
      w.name.toLowerCase() === workspaceQueryLower || 
      w.alias?.toLowerCase() === workspaceQueryLower ||
      w.name.toLowerCase().startsWith(workspaceQueryLower) ||
      (w.alias && w.alias.toLowerCase().startsWith(workspaceQueryLower))
    );

    if (!workspace) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Workspace not found",
        message: `No workspace matching "${workspaceQuery}"`,
      });
      return;
    }

    // Create Linear client
    const client = new LinearClient({ accessToken: workspace.accessToken });
    
    // Get teams
    const teams = await client.teams();
    let selectedTeam = teams.nodes[0]; // Default to first team
    
    if (!selectedTeam) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No team found",
        message: "Workspace has no teams",
      });
      return;
    }

    // Handle project if specified
    let projectId: string | undefined;
    if (projectQuery) {
      const projectQueryLower = projectQuery.toLowerCase();
      const projects = await client.projects({
        filter: { 
          team: { id: { eq: selectedTeam.id } }
        }
      });
      
      const project = projects.nodes.find(p => 
        p.name.toLowerCase() === projectQueryLower ||
        p.key?.toLowerCase() === projectQueryLower ||
        p.name.toLowerCase().startsWith(projectQueryLower)
      );
      
      if (project) {
        projectId = project.id;
        // If we found a project, use its team
        const projectTeam = await project.team;
        if (projectTeam) {
          selectedTeam = projectTeam;
        }
      }
    }

    // Create the issue
    const result = await client.createIssue({
      title,
      description: description || undefined,
      teamId: selectedTeam.id,
      projectId,
    });

    await showToast({
      style: Toast.Style.Success,
      title: "Issue created",
      message: `Created in ${workspace.alias || workspace.name}${projectId ? ' (with project)' : ''}`,
      primaryAction: {
        title: "Open in Linear",
        onAction: async () => {
          if (result.issue) {
            await open(result.issue.url);
          }
        },
      },
    });

    // Close the Raycast window
    await closeMainWindow();
  } catch (error) {
    console.error("Error creating issue:", error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to create issue",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}