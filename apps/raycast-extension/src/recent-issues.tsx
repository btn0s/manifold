import { List, ActionPanel, Action, showToast, Toast, Icon, Color } from "@raycast/api";
import { useState, useEffect } from "react";
import { useMultiWorkspace, WorkspaceIssue } from "./hooks/useMultiWorkspace";
import AddWorkspace from "./add-workspace";
import ManageWorkspaces from "./manage-workspaces";
import CreateIssue from "./create-issue";

export default function RecentIssues() {
  const { workspaces, isLoading: workspacesLoading, getRecentIssues, reloadWorkspaces } = useMultiWorkspace();
  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState<WorkspaceIssue[]>([]);

  useEffect(() => {
    if (!workspacesLoading && workspaces.length > 0) {
      loadRecentIssues();
    } else if (!workspacesLoading && workspaces.length === 0) {
      setIsLoading(false);
    }
  }, [workspacesLoading, workspaces]);

  async function loadRecentIssues() {
    try {
      setIsLoading(true);
      const recent = await getRecentIssues(30); // Limit to 30 recent issues
      setIssues(recent);
    } catch (error) {
      console.error("Error loading recent issues:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to load recent issues",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function getWorkspaceColor(workspace: { color?: string; name: string }): Color {
    if (workspace.color) {
      const colorMap: Record<string, Color> = {
        blue: Color.Blue,
        purple: Color.Purple,
        green: Color.Green,
        red: Color.Red,
        orange: Color.Orange,
        yellow: Color.Yellow,
      };
      return colorMap[workspace.color] || Color.SecondaryText;
    }
    
    const colors = [Color.Blue, Color.Purple, Color.Green, Color.Orange, Color.Yellow, Color.Magenta];
    const index = workspace.name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  if (workspaces.length === 0 && !workspacesLoading) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.Building}
          title="No workspaces connected"
          description="Add your Linear workspaces to get started"
          actions={
            <ActionPanel>
              <Action.Push
                title="Add Workspace"
                icon={Icon.Plus}
                target={<AddWorkspace onAdded={reloadWorkspaces} />}
              />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List
      isLoading={isLoading || workspacesLoading}
      navigationTitle="Recent Issues"
    >
      <List.Section title="Recent Issues" subtitle={`${issues.length} issues`}>
        {issues.map(({ issue, workspace }) => {
          const workspaceTag = workspace.alias || workspace.name;
          
          return (
            <List.Item
              key={`${workspace.id}-${issue.id}`}
              title={issue.title}
              subtitle={issue.identifier}
              accessories={[
                { 
                  tag: { 
                    value: workspaceTag, 
                    color: getWorkspaceColor(workspace) 
                  } 
                },
                issue.state ? { text: issue.state.name } : {},
                issue.priority ? { text: `P${issue.priority}` } : {},
                { date: new Date(issue.updatedAt), tooltip: "Last updated" }
              ]}
              actions={
                <ActionPanel>
                  <ActionPanel.Section>
                    <Action.OpenInBrowser
                      title="Open in Linear"
                      url={issue.url}
                    />
                    <Action.CopyToClipboard
                      title="Copy Issue URL"
                      content={issue.url}
                      shortcut={{ modifiers: ["cmd"], key: "c" }}
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section>
                    <Action.Push
                      title="Create Issue"
                      icon={Icon.Plus}
                      shortcut={{ modifiers: ["cmd"], key: "n" }}
                      target={<CreateIssue />}
                    />
                    <Action
                      title="Refresh"
                      icon={Icon.RotateClockwise}
                      shortcut={{ modifiers: ["cmd"], key: "r" }}
                      onAction={loadRecentIssues}
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section>
                    <Action.Push
                      title="Manage Workspaces"
                      icon={Icon.Gear}
                      shortcut={{ modifiers: ["cmd"], key: "," }}
                      target={<ManageWorkspaces />}
                    />
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          );
        })}
      </List.Section>
    </List>
  );
}