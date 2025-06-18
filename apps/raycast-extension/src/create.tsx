import { Form, ActionPanel, Action, showToast, Toast, popToRoot, Icon, useNavigation } from "@raycast/api";
import { useState, useEffect } from "react";
import { LinearClient } from "@linear/sdk";
import { Workspace, WorkspaceStorage } from "./workspace-storage";
import ManageWorkspaces from "./manage-workspaces";

interface Team {
  id: string;
  name: string;
  key: string;
}

interface Project {
  id: string;
  name: string;
  key: string;
}

export default function QuickCreateIssue() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useNavigation();

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspaceId) {
      loadTeams(selectedWorkspaceId);
    }
  }, [selectedWorkspaceId]);

  useEffect(() => {
    if (selectedTeamId && selectedWorkspaceId) {
      loadProjects(selectedWorkspaceId, selectedTeamId);
    }
  }, [selectedTeamId, selectedWorkspaceId]);

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
      const teamsList = teamsData.nodes.map(team => ({ 
        id: team.id, 
        name: team.name,
        key: team.key
      }));
      setTeams(teamsList);
      
      // Select first team by default
      if (teamsList.length > 0) {
        setSelectedTeamId(teamsList[0].id);
      }
    } catch (error) {
      console.error("Error loading teams:", error);
      setTeams([]);
    }
  }

  async function loadProjects(workspaceId: string, teamId: string) {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (!workspace) return;

    try {
      const client = new LinearClient({ accessToken: workspace.accessToken });
      const projectsData = await client.projects({
        filter: { 
          team: { id: { eq: teamId } }
        }
      });
      setProjects(projectsData.nodes.map(project => ({ 
        id: project.id, 
        name: project.name,
        key: project.key || project.name.substring(0, 3).toUpperCase()
      })));
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]);
    }
  }

  async function handleSubmit(values: { title: string; description: string }) {
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
      setIsSubmitting(true);
      const client = new LinearClient({ accessToken: workspace.accessToken });
      
      const issueData: any = {
        title: values.title,
        description: values.description || undefined,
        teamId: selectedTeamId,
      };

      if (selectedProjectId) {
        issueData.projectId = selectedProjectId;
      }

      const result = await client.createIssue(issueData);

      showToast({
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

      popToRoot();
    } catch (error) {
      console.error("Error creating issue:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to create issue",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
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
      isLoading={isLoading || isSubmitting}
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
        storeValue
      >
        {workspaces.map((workspace) => (
          <Form.Dropdown.Item
            key={workspace.id}
            value={workspace.id}
            title={workspace.name}
            subtitle={workspace.alias ? `@${workspace.alias}` : undefined}
            icon={workspace.alias ? { source: Icon.Tag, tintColor: getWorkspaceColor(workspace) } : undefined}
          />
        ))}
      </Form.Dropdown>

      <Form.Dropdown
        id="team"
        title="Team"
        value={selectedTeamId}
        onChange={setSelectedTeamId}
        storeValue
      >
        {teams.map((team) => (
          <Form.Dropdown.Item
            key={team.id}
            value={team.id}
            title={team.name}
            subtitle={team.key}
          />
        ))}
      </Form.Dropdown>

      {projects.length > 0 && (
        <Form.Dropdown
          id="project"
          title="Project"
          value={selectedProjectId}
          onChange={setSelectedProjectId}
        >
          <Form.Dropdown.Item value="" title="No Project" />
          {projects.map((project) => (
            <Form.Dropdown.Item
              key={project.id}
              value={project.id}
              title={project.name}
              subtitle={project.key}
            />
          ))}
        </Form.Dropdown>
      )}

      <Form.Separator />

      <Form.TextField
        id="title"
        title="Title"
        placeholder="Fix the login bug"
        autoFocus
      />

      <Form.TextArea
        id="description"
        title="Description"
        placeholder="Add more details..."
        enableMarkdown
      />
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
import { open } from "@raycast/api";