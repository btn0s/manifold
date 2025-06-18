import { OAuthService, withAccessToken, getAccessToken } from "@raycast/utils";
import { LinearClient } from "@linear/sdk";

// Configure Linear OAuth service with necessary scopes
export const linear = OAuthService.linear({
  scope: "read write issues:create comments:create",
  onAuthorize({ token }) {
    console.log("Linear OAuth authorized successfully");
  },
});

// Type for our workspace configuration
export interface Workspace {
  id: string;
  name: string;
  alias?: string;
  apiKey: string;
  teamId?: string;
  organizationId?: string;
}

// Create a Linear client for the current workspace
export function createLinearClient(accessToken: string): LinearClient {
  return new LinearClient({ accessToken });
}

// Higher-order component to ensure authentication
export const withLinearAuth = withAccessToken(linear);