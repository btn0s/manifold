import { Form, ActionPanel, Action, showToast, Toast, popToRoot, Icon, open } from "@raycast/api";
import { useState } from "react";
import { OAuth } from "@raycast/api";
import { OAuthService } from "@raycast/utils";
import { WorkspaceStorage } from "./workspace-storage";
import { nanoid } from "nanoid";

const clientId = "b1fcb064dfaf8f3ed3b6e5aa66f0e6b0"; // Linear OAuth app for Manifold

interface FormValues {
  alias: string;
}

export default function AddWorkspaceForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      // Create a new OAuth client for this workspace
      const oauthClient = new OAuth.PKCEClient({
        redirectMethod: OAuth.RedirectMethod.Web,
        providerName: "Linear",
        providerIcon: "extension-icon.png",
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
        },
      });

      const { authorizationCode } = await oauthClient.authorize(authRequest);
      
      const tokenResponse = await oauthClient.tokenRequest({
        authorizationCode,
        endpoint: "https://api.linear.app/oauth/token",
        clientId: clientId,
        context: authRequest.codeVerifier,
      });

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

      popToRoot();
    } catch (error) {
      console.error("Error adding workspace:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to add workspace",
        message: error instanceof Error ? error.message : "Unknown error",
      });
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