import { List, ActionPanel, Action, Icon, confirmAlert, Alert, showToast, Toast, Color, Form, popToRoot } from "@raycast/api";
import { useState, useEffect } from "react";
import { Workspace, WorkspaceStorage } from "./workspace-storage";
import AddWorkspace from "./add-workspace";

export default function ManageWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  async function loadWorkspaces() {
    try {
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

  async function handleRemoveWorkspace(workspace: Workspace) {
    const confirmed = await confirmAlert({
      title: "Remove Workspace",
      message: `Are you sure you want to remove "${workspace.name}"?`,
      primaryAction: {
        title: "Remove",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      try {
        await WorkspaceStorage.removeWorkspace(workspace.id);
        await loadWorkspaces();
        showToast({
          style: Toast.Style.Success,
          title: "Workspace removed",
          message: `Removed ${workspace.name}`,
        });
      } catch (error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to remove workspace",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }


  function getWorkspaceColor(workspace: Workspace): Color {
    const colors = [Color.Blue, Color.Purple, Color.Green, Color.Orange, Color.Yellow, Color.Magenta];
    const index = workspace.name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  return (
    <List isLoading={isLoading} navigationTitle="Manage Workspaces">
      {workspaces.length === 0 ? (
        <List.EmptyView
          icon={Icon.Building}
          title="No workspaces"
          description="Add your first Linear workspace to get started"
          actions={
            <ActionPanel>
              <Action.Push
                title="Add Workspace"
                icon={Icon.Plus}
                target={<AddWorkspace onAdded={loadWorkspaces} />}
              />
            </ActionPanel>
          }
        />
      ) : (
        <>
          {workspaces.map((workspace) => (
            <List.Item
              key={workspace.id}
              title={workspace.name}
              subtitle={workspace.email}
              accessories={[
                workspace.alias ? { 
                  tag: { 
                    value: `@${workspace.alias}`, 
                    color: getWorkspaceColor(workspace) 
                  } 
                } : {},
              ]}
              actions={
                <ActionPanel>
                  <ActionPanel.Section>
                    <Action.Push
                      title="Edit Alias"
                      icon={Icon.Pencil}
                      target={<EditAliasForm workspace={workspace} onUpdate={loadWorkspaces} />}
                    />
                    <Action
                      title="Remove Workspace"
                      icon={Icon.Trash}
                      style={Action.Style.Destructive}
                      shortcut={{ modifiers: ["cmd"], key: "delete" }}
                      onAction={() => handleRemoveWorkspace(workspace)}
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section>
                    <Action.Push
                      title="Add Another Workspace"
                      icon={Icon.Plus}
                      shortcut={{ modifiers: ["cmd"], key: "n" }}
                      target={<AddWorkspace onAdded={loadWorkspaces} />}
                    />
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          ))}
        </>
      )}
    </List>
  );
}

function EditAliasForm({ workspace, onUpdate }: { workspace: Workspace; onUpdate: () => void }) {
  const [alias, setAlias] = useState(workspace.alias || "");

  async function handleSubmit() {
    try {
      await WorkspaceStorage.updateWorkspaceAlias(workspace.id, alias);
      showToast({
        style: Toast.Style.Success,
        title: "Alias updated",
        message: `Updated alias for ${workspace.name}`,
      });
      onUpdate();
      popToRoot();
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to update alias",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Alias" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="alias"
        title="Workspace Alias"
        value={alias}
        onChange={setAlias}
        placeholder="e.g., client1, personal, work"
        info={`Short name for ${workspace.name}`}
      />
    </Form>
  );
}