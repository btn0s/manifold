import { showToast, Toast, LaunchProps, closeMainWindow, open } from "@raycast/api";
import { LinearClient } from "@linear/sdk";
import { WorkspaceStorage } from "./workspace-storage";

interface CreateArguments {
  title: string;
  description?: string;
}

export default async function QuickCreate(props: LaunchProps<{ arguments: CreateArguments }>) {
  const { title, description } = props.arguments;
  
  if (!title || title.trim().length === 0) {
    await showToast({
      style: Toast.Style.Failure,
      title: "No title provided",
      message: "Title is required",
    });
    return;
  }

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
        message: "Add a workspace first",
      });
      return;
    }

    // Parse the title to extract workspace
    const words = title.split(' ');
    if (words.length < 2) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Invalid format",
        message: "Format: workspace-name issue title",
      });
      return;
    }

    const workspaceIdentifier = words[0].toLowerCase();
    const issueTitle = words.slice(1).join(' ');

    // Find matching workspace
    const workspace = workspaces.find(w => 
      w.name.toLowerCase() === workspaceIdentifier || 
      w.alias?.toLowerCase() === workspaceIdentifier ||
      w.name.toLowerCase().startsWith(workspaceIdentifier)
    );

    if (!workspace) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Workspace not found",
        message: `No workspace matching "${workspaceIdentifier}"`,
      });
      return;
    }

    // Create Linear client
    const client = new LinearClient({ accessToken: workspace.accessToken });
    
    // Get the first team (or default team)
    const teams = await client.teams();
    const team = teams.nodes[0];
    
    if (!team) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No team found",
        message: "Workspace has no teams",
      });
      return;
    }

    // Create the issue
    const result = await client.createIssue({
      title: issueTitle,
      description: description || undefined,
      teamId: team.id,
    });

    await showToast({
      style: Toast.Style.Success,
      title: "Issue created",
      message: `Created in ${workspace.alias || workspace.name}`,
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