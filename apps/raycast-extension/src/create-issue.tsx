import { Form, ActionPanel, Action, showToast, Toast, popToRoot, Icon, useNavigation } from "@raycast/api";
import { useState, useEffect } from "react";
import { LinearClient } from "@linear/sdk";
import { Workspace, WorkspaceStorage } from "./workspace-storage";
import ManageWorkspaces from "./manage-workspaces";

interface Team {
  id: string;
  name: string;
}

export default function CreateIssue() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { push } = useNavigation();

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    // Parse @workspace syntax from title
    const match = title.match(/^@(\w+)\s+(.*)$/);
    if (match) {
      const [, alias, restOfTitle] = match;
      const workspace = workspaces.find(w => w.alias?.toLowerCase() === alias.toLowerCase());
      if (workspace) {
        setSelectedWorkspaceId(workspace.id);
        setTitle(restOfTitle);
      }
    }
  }, [title, workspaces]);

  useEffect(() => {
    if (selectedWorkspaceId) {
      loadTeams(selectedWorkspaceId);
    }
  }, [selectedWorkspaceId]);

  async function loadWorkspaces() {
    try {
      const stored = await WorkspaceStorage.getWorkspaces();
      setWorkspaces(stored);
      
      // Select first workspace by default
      if (stored.length > 0) {
        setSelectedWorkspaceId(stored[0].id);
      }
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

  async function loadTeams(workspaceId: string) {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (!workspace) return;

    try {
      const client = new LinearClient({ accessToken: workspace.accessToken });
      const teamsData = await client.teams();
      setTeams(teamsData.nodes.map(team => ({ id: team.id, name: team.name })));
    } catch (error) {
      console.error("Error loading teams:", error);
      setTeams([]);
    }
  }

  async function handleSubmit(values: { title: string; description: string; teamId: string }) {
    const workspace = workspaces.find(w => w.id === selectedWorkspaceId);
    if (!workspace) {
      showToast({
        style: Toast.Style.Failure,
        title: "No workspace selected",
        message: "Please select a workspace",
      });
      return;
    }

    try {
      setIsLoading(true);
      const client = new LinearClient({ accessToken: workspace.accessToken });
      
      const issue = await client.createIssue({
        title: values.title,
        description: values.description || undefined,
        teamId: values.teamId,
      });

      showToast({
        style: Toast.Style.Success,
        title: "Issue created",
        message: `Created in ${workspace.alias || workspace.name}`,
      });

      // Open the issue in Linear
      if (issue.issue) {
        await Action.OpenInBrowser.perform({ url: issue.issue.url });
      }

      popToRoot();
    } catch (error) {
      console.error("Error creating issue:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to create issue",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (workspaces.length === 0 && !isLoading) {
    return (
      <Form
        actions={
          <ActionPanel>
            <Action.Push
              title="Add Workspace"
              icon={Icon.Plus}
              target={<AddWorkspace onAdded={loadWorkspaces} />}
            />
          </ActionPanel>
        }
      >
        <Form.Description
          title="No Workspaces"
          text="Add a Linear workspace to start creating issues."
        />
      </Form>
    );
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Create Issue"
            onSubmit={handleSubmit}
            icon={Icon.Plus}
          />
          <Action.Push
            title="Manage Workspaces"
            icon={Icon.Gear}
            shortcut={{ modifiers: ["cmd"], key: "," }}
            target={<ManageWorkspaces />}
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown
        id="workspace"
        title="Workspace"
        value={selectedWorkspaceId}
        onChange={setSelectedWorkspaceId}
      >
        {workspaces.map((workspace) => (
          <Form.Dropdown.Item
            key={workspace.id}
            value={workspace.id}
            title={workspace.name}
            icon={workspace.alias ? { source: Icon.Tag, tintColor: getWorkspaceColor(workspace) } : undefined}
          />
        ))}
      </Form.Dropdown>

      <Form.TextField
        id="title"
        title="Title"
        placeholder="Fix the bug (or @client1 Fix the bug)"
        value={title}
        onChange={setTitle}
        info="Use @alias syntax to quickly select a workspace"
      />

      <Form.TextArea
        id="description"
        title="Description"
        placeholder="Add more details..."
        value={description}
        onChange={setDescription}
        enableMarkdown
      />

      <Form.Dropdown
        id="teamId"
        title="Team"
        storeValue
      >
        {teams.map((team) => (
          <Form.Dropdown.Item key={team.id} value={team.id} title={team.name} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}

function getWorkspaceColor(workspace: Workspace): string {
  const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F97316", "#EAB308", "#EC4899"];
  const index = workspace.name.charCodeAt(0) % colors.length;
  return colors[index];
}

// Import from add-workspace
import AddWorkspace from "./add-workspace";