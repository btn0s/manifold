import { List, Form, ActionPanel, Action, showToast, Toast, popToRoot, Icon, LaunchProps, Clipboard, open } from "@raycast/api";
import { useState, useEffect } from "react";
import { LinearClient } from "@linear/sdk";
import { Workspace, WorkspaceStorage } from "./workspace-storage";
import ManageWorkspaces from "./manage-workspaces";

interface Project {
  id: string;
  name: string;
  key: string;
}

type Step = "workspace" | "project" | "title" | "description" | "priority" | "success";

interface CreatedIssue {
  url: string;
  identifier: string;
  title: string;
}

export default function CreateIssue() {
  // Multi-step state
  const [currentStep, setCurrentStep] = useState<Step>("workspace");
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [issuePriority, setIssuePriority] = useState<string>("0");
  const [createdIssue, setCreatedIssue] = useState<CreatedIssue | null>(null);

  // Data state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (currentStep === "workspace") {
      loadWorkspaces();
    } else if (currentStep === "project" && selectedWorkspace) {
      loadProjects(selectedWorkspace);
    }
  }, [currentStep, selectedWorkspace]);

  async function loadWorkspaces() {
    try {
      setIsLoading(true);
      const stored = await WorkspaceStorage.getWorkspaces();
      setWorkspaces(stored);
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

  async function loadProjects(workspace: Workspace) {
    try {
      setIsLoading(true);
      const client = new LinearClient({ accessToken: workspace.accessToken });
      const projectsData = await client.projects();
      setProjects(projectsData.nodes.map(project => ({
        id: project.id,
        name: project.name,
        key: project.name.substring(0, 3).toUpperCase()
      })));
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleWorkspaceSelect(workspace: Workspace) {
    setSelectedWorkspace(workspace);
    setCurrentStep("project");
  }

  async function handleProjectSelect(project: Project | null) {
    setSelectedProject(project);
    setCurrentStep("title");
  }

  async function handleTitleSubmit(values: { title: string }) {
    if (!values.title.trim()) {
      showToast({
        style: Toast.Style.Failure,
        title: "Title required",
        message: "Please enter an issue title",
      });
      return;
    }
    setIssueTitle(values.title);
    setCurrentStep("description");
  }

  async function handleDescriptionSubmit(description: string) {
    setIssueDescription(description);
    setCurrentStep("priority");
  }

  async function handlePrioritySelect(priority: string) {
    setIssuePriority(priority);
    await createIssue();
  }

  async function createIssue() {
    if (!selectedWorkspace) return;

    try {
      setIsLoading(true);
      const client = new LinearClient({ accessToken: selectedWorkspace.accessToken });

      // Get the default team for the user
      const viewer = await client.viewer;
      const teams = await viewer.teams();

      if (teams.nodes.length === 0) {
        throw new Error("No teams found for this user");
      }

      // Use the first team as default
      const defaultTeam = teams.nodes[0];

      const issueData: any = {
        title: issueTitle || "Untitled Issue",
        description: issueDescription || undefined,
        priority: issuePriority ? parseInt(issuePriority) : undefined,
        teamId: defaultTeam?.id || "",
      };

      if (selectedProject) {
        issueData.projectId = selectedProject.id;
      }

      const result = await client.createIssue(issueData);

      if (result.issue) {
        const issueResult = await result.issue;
        if (issueResult) {
          await Clipboard.copy(issueResult.url);

          setCreatedIssue({
            url: issueResult.url,
            identifier: issueResult.identifier,
            title: issueResult.title,
          });

          setCurrentStep("success");
        }
      }
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

  // Step 1: Select Workspace
  if (currentStep === "workspace") {
    const filteredWorkspaces = workspaces.filter(workspace => {
      const query = searchText.toLowerCase();
      return (
        workspace.name.toLowerCase().includes(query) ||
        (workspace.alias && workspace.alias.toLowerCase().includes(query))
      );
    });

    return (
      <List
        isLoading={isLoading}
        navigationTitle="Select Workspace"
        searchBarPlaceholder="Search by name or alias..."
        onSearchTextChange={setSearchText}
      >
        {filteredWorkspaces.length === 0 && !isLoading ? (
          <List.EmptyView
            icon={Icon.Building}
            title="No workspaces found"
            description={workspaces.length === 0 ? "Add your first Linear workspace" : "Try a different search"}
            actions={
              <ActionPanel>
                <Action.Push
                  title="Manage Workspaces"
                  icon={Icon.Gear}
                  target={<ManageWorkspaces />}
                />
              </ActionPanel>
            }
          />
        ) : (
          filteredWorkspaces.map((workspace) => (
            <List.Item
              key={workspace.id}
              title={workspace.name}
              subtitle={workspace.alias ? `@${workspace.alias}` : workspace.email}
              icon={Icon.Building}
              actions={
                <ActionPanel>
                  <Action
                    title="Select Workspace"
                    icon={Icon.Check}
                    onAction={() => handleWorkspaceSelect(workspace)}
                  />
                  <Action.Push
                    title="Manage Workspaces"
                    icon={Icon.Gear}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "m" }}
                    target={<ManageWorkspaces />}
                  />
                </ActionPanel>
              }
            />
          ))
        )}
      </List>
    );
  }

  // Step 2: Select Project (Optional)
  if (currentStep === "project") {
    return (
      <List
        isLoading={isLoading}
        navigationTitle="Select Project (Optional)"
        searchBarPlaceholder="Search projects or press Enter to skip..."
      >
        <List.Item
          title="No Project"
          subtitle="Skip project selection"
          icon={Icon.XMarkCircle}
          actions={
            <ActionPanel>
              <Action
                title="Skip Project"
                icon={Icon.ArrowRight}
                onAction={() => handleProjectSelect(null)}
              />
            </ActionPanel>
          }
        />
        {projects.map((project) => (
          <List.Item
            key={project.id}
            title={project.name}
            subtitle={project.key}
            icon={Icon.Folder}
            actions={
              <ActionPanel>
                <Action
                  title="Select Project"
                  icon={Icon.Check}
                  onAction={() => handleProjectSelect(project)}
                />
                <Action
                  title="Skip Project"
                  icon={Icon.ArrowRight}
                  shortcut={{ modifiers: ["cmd"], key: "return" }}
                  onAction={() => handleProjectSelect(null)}
                />
              </ActionPanel>
            }
          />
        ))}
      </List>
    );
  }

  // Step 3: Add Title (Required)
  if (currentStep === "title") {
    return (
      <Form
        navigationTitle="Issue Title"
        actions={
          <ActionPanel>
            <Action.SubmitForm
              title="Continue"
              icon={Icon.ArrowRight}
              onSubmit={handleTitleSubmit}
            />
          </ActionPanel>
        }
      >
        <Form.Description text="Enter a title for your issue" />
        <Form.TextField
          id="title"
          title="Title"
          placeholder="Fix the login bug"
          value={issueTitle}
          onChange={setIssueTitle}
          autoFocus
        />
      </Form>
    );
  }

  // Step 4: Add Description (Optional)
  if (currentStep === "description") {
    return (
      <Form
        navigationTitle="Issue Description (Optional)"
        actions={
          <ActionPanel>
            <Action.SubmitForm
              title="Continue"
              icon={Icon.ArrowRight}
              onSubmit={(values) => handleDescriptionSubmit(values.description)}
            />
            <Action
              title="Skip Description"
              icon={Icon.ArrowRight}
              shortcut={{ modifiers: ["cmd"], key: "return" }}
              onAction={() => handleDescriptionSubmit("")}
            />
          </ActionPanel>
        }
      >
        <Form.Description text="Add details or press Enter to skip" />
        <Form.TextArea
          id="description"
          title="Description"
          placeholder="Add more details..."
          value={issueDescription}
          onChange={setIssueDescription}
          enableMarkdown
          autoFocus
        />
      </Form>
    );
  }

  // Step 5: Choose Priority
  if (currentStep === "priority") {
    const priorities = [
      { value: "0", title: "No Priority", icon: "⚪" },
      { value: "1", title: "Urgent", icon: "🔴" },
      { value: "2", title: "High", icon: "🟠" },
      { value: "3", title: "Normal", icon: "🟡" },
      { value: "4", title: "Low", icon: "🟢" },
    ];

    return (
      <List
        isLoading={isLoading}
        navigationTitle="Select Priority"
      >
        {priorities.map((priority) => (
          <List.Item
            key={priority.value}
            title={priority.title}
            icon={priority.icon}
            actions={
              <ActionPanel>
                <Action
                  title="Create Issue"
                  icon={Icon.Plus}
                  onAction={() => handlePrioritySelect(priority.value)}
                />
              </ActionPanel>
            }
          />
        ))}
      </List>
    );
  }

  // Step 6: Success
  if (currentStep === "success" && createdIssue) {
    return (
      <List navigationTitle="Issue Created Successfully!">
        <List.Section title="Issue Details">
          <List.Item
            title={createdIssue.title}
            subtitle={createdIssue.identifier}
            icon={{ source: Icon.CheckCircle, tintColor: "#10B981" }}
            accessories={[
              { tag: { value: "Copied to Clipboard", color: "#10B981" } }
            ]}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser
                  title="Open in Linear"
                  url={createdIssue.url}
                  icon={Icon.Globe}
                />
                <Action.CopyToClipboard
                  title="Copy URL"
                  content={createdIssue.url}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                />
                <Action
                  title="Create Another Issue"
                  icon={Icon.Plus}
                  shortcut={{ modifiers: ["cmd"], key: "n" }}
                  onAction={() => {
                    // Reset state for new issue
                    setCurrentStep("workspace");
                    setSelectedWorkspace(null);
                    setSelectedProject(null);
                    setIssueTitle("");
                    setIssueDescription("");
                    setIssuePriority("0");
                    setCreatedIssue(null);
                  }}
                />
                <Action
                  title="Close"
                  icon={Icon.XMarkCircle}
                  shortcut={{ modifiers: ["cmd"], key: "w" }}
                  onAction={() => popToRoot()}
                />
              </ActionPanel>
            }
          />
        </List.Section>
        <List.Section title="What's Next?">
          <List.Item
            title="Press Enter to open in Linear"
            icon={Icon.ArrowRight}
          />
          <List.Item
            title="Press ⌘+N to create another issue"
            icon={Icon.ArrowRight}
          />
          <List.Item
            title="Press ⌘+W to close"
            icon={Icon.ArrowRight}
          />
        </List.Section>
      </List>
    );
  }

  return null;
}
