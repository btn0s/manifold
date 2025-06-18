import { List, ActionPanel, Action, showToast, Toast, Icon, Color } from "@raycast/api";
import { useState, useEffect } from "react";
import { useMultiWorkspace, WorkspaceIssue } from "./hooks/useMultiWorkspace";

export default function SearchIssues() {
  const { workspaces, isLoading: workspacesLoading, searchAllWorkspaces, getRecentIssues } = useMultiWorkspace();
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<WorkspaceIssue[]>([]);
  const [searchText, setSearchText] = useState("");

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
      const recent = await getRecentIssues();
      setSearchResults(recent);
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

  async function performSearch(query: string) {
    if (!query.trim() || workspaces.length === 0) return;

    try {
      setIsLoading(true);
      const results = await searchAllWorkspaces(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Search failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Generate a color for workspace badge
  function getWorkspaceColor(workspace: { color?: string; name: string }): Color {
    if (workspace.color) {
      // Map Linear colors to Raycast colors
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
    
    // Generate color based on workspace name
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
                target={<AddWorkspace onAdded={loadRecentIssues} />}
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
      searchBarPlaceholder="Search issues across all workspaces..."
      searchText={searchText}
      onSearchTextChange={(text) => {
        setSearchText(text);
        if (text.length > 2) {
          performSearch(text);
        } else if (text.length === 0) {
          loadRecentIssues();
        }
      }}
    >
      {searchResults.length === 0 ? (
        <List.EmptyView
          icon={Icon.MagnifyingGlass}
          title="No issues found"
          description={searchText ? "Try a different search query" : "Your recent issues will appear here"}
        />
      ) : (
        searchResults.map(({ issue, workspace }) => {
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
                      target={<CreateIssue defaultWorkspace={workspace} />}
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section>
                    <Action.Push
                      title="Manage Workspaces"
                      icon={Icon.Gear}
                      shortcut={{ modifiers: ["cmd"], key: "," }}
                      target={<ManageWorkspaces onUpdate={loadRecentIssues} />}
                    />
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          );
        })
      )}
    </List>
  );
}

import AddWorkspace from "./add-workspace";
import ManageWorkspaces from "./manage-workspaces";

// Placeholder component - we'll implement this next
function CreateIssue({ defaultWorkspace }: { defaultWorkspace: any }) {
  return <List><List.Item title="Create Issue - Coming Soon" /></List>;
}