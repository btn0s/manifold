import { List, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useState } from "react";

export default function Command() {
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Implement Linear OAuth
  // TODO: Load workspaces
  // TODO: Implement issue search across workspaces

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search issues across all workspaces...">
      <List.EmptyView
        icon="📋"
        title="No Linear workspaces connected"
        description="Connect your Linear workspaces to get started"
        actions={
          <ActionPanel>
            <Action
              title="Connect Linear Workspace"
              onAction={() => {
                showToast({
                  style: Toast.Style.Success,
                  title: "Coming soon!",
                  message: "OAuth integration will be implemented",
                });
              }}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
