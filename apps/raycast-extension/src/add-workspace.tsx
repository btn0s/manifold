import { Form, ActionPanel, Action, showToast, Toast, popToRoot, Icon } from "@raycast/api";
import { useState } from "react";
import { getAccessToken } from "@raycast/utils";
import { withLinearAuth } from "./auth";
import { WorkspaceStorage } from "./workspace-storage";
import { nanoid } from "nanoid";

interface FormValues {
  alias: string;
}

function AddWorkspaceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = getAccessToken();

  async function handleSubmit(values: FormValues) {
    if (!token) {
      showToast({
        style: Toast.Style.Failure,
        title: "Not authenticated",
        message: "Please authenticate with Linear first",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Fetch workspace info using the current OAuth token
      const info = await WorkspaceStorage.fetchWorkspaceInfo(token);
      
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
        accessToken: token,
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
            title="Add Workspace"
            onSubmit={handleSubmit}
            icon={Icon.Plus}
          />
        </ActionPanel>
      }
    >
      <Form.Description
        title="Add Linear Workspace"
        text="You're authenticated with Linear. Add this workspace to Manifold to manage it alongside your other workspaces."
      />
      
      <Form.TextField
        id="alias"
        title="Workspace Alias"
        placeholder="e.g., client1, personal, work"
        info="Optional short name for quick access (e.g., @client1)"
      />
      
      <Form.Description
        text="The workspace details will be fetched from your current Linear authentication."
      />
    </Form>
  );
}

export default withLinearAuth(AddWorkspaceForm);