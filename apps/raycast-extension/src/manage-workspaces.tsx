import { List, ActionPanel, Action, Icon, confirmAlert, Alert, showToast, Toast, Color, Form, popToRoot, OAuth, open } from "@raycast/api";
import { useState, useEffect } from "react";
import { Workspace, WorkspaceStorage } from "./workspace-storage";
import { nanoid } from "nanoid";

// Replace with your Linear OAuth app client ID
const clientId = "912c5365f2a33be0063ece9980e49351";

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
                      shortcut={{ modifiers: ["cmd"], key: "backspace" }}
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

interface AddWorkspaceProps {
  onAdded: () => void;
}

function AddWorkspace({ onAdded }: AddWorkspaceProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: { alias: string }) {
    setIsLoading(true);

    try {
      // Create a new OAuth client for this workspace
      const oauthClient = new OAuth.PKCEClient({
        redirectMethod: OAuth.RedirectMethod.Web,
        providerName: "Linear",
        providerIcon: "manifold.png",
        providerId: "linear",
        description: "Connect a new Linear workspace to Manifold",
      });

      // Start the OAuth flow
      const authRequest = await oauthClient.authorizationRequest({
        endpoint: "https://linear.app/oauth/authorize",
        clientId: clientId,
        scope: "read write issues:create comments:create",
        extraParameters: {
          actor: "user",
          prompt: "login", // Force re-authentication to allow workspace selection
          redirect_uri: "https://raycast.com/redirect/extension", // Explicit redirect URI for providers that don't accept query params
        },
      });

      const { authorizationCode } = await oauthClient.authorize(authRequest);

      // Exchange authorization code for access token
      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("code", authorizationCode);
      params.append("code_verifier", authRequest.codeVerifier);
      params.append("grant_type", "authorization_code");
      params.append("redirect_uri", "https://raycast.com/redirect/extension"); // Must match what's in Linear OAuth app

      const response = await fetch("https://api.linear.app/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Token exchange error:", errorText);
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const tokenResponse = await response.json();

      if (!tokenResponse.access_token) {
        throw new Error("No access token received");
      }

      // Fetch workspace info using the new token
      const info = await WorkspaceStorage.fetchWorkspaceInfo(tokenResponse.access_token);
      
      // Check if workspace already exists
      const existing = await WorkspaceStorage.getWorkspaces();
      if (existing.some(w => w.organizationId === info.organizationId)) {
        showToast({
          style: Toast.Style.Failure,
          title: "Workspace already added",
          message: `${info.organizationName} is already in your workspaces`,
        });
        return;
      }

      // Add the workspace
      await WorkspaceStorage.addWorkspace({
        id: nanoid(),
        name: info.organizationName,
        alias: values.alias || undefined,
        accessToken: tokenResponse.access_token,
        organizationId: info.organizationId,
        email: info.email,
      });

      showToast({
        style: Toast.Style.Success,
        title: "Workspace added",
        message: `Added ${info.organizationName} to your workspaces`,
      });

      onAdded();
      popToRoot();
    } catch (error) {
      console.error("Error adding workspace:", error);
      
      // Show detailed error information
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check for OAuth-specific errors
        if (error.message.includes("invalid_request") || error.message.includes("redirect_uri")) {
          errorMessage = "OAuth configuration error. Check redirect URI in Linear OAuth app.";
        }
      }
      
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to add workspace",
        message: errorMessage,
      });
      
      // Log full error details
      console.error("Full error details:", JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Connect New Workspace"
            onSubmit={handleSubmit}
            icon={Icon.Plus}
          />
        </ActionPanel>
      }
    >
      <Form.Description
        title="Add Linear Workspace"
        text="Connect a new Linear workspace to Manifold. You'll be prompted to authenticate and select which workspace to add."
      />
      
      <Form.TextField
        id="alias"
        title="Workspace Alias"
        placeholder="e.g., client1, personal, work"
        info="Optional short name for quick access (e.g., @client1)"
      />
      
      <Form.Description
        text="Click 'Connect New Workspace' to authenticate with Linear and select a workspace."
      />
    </Form>
  );
}