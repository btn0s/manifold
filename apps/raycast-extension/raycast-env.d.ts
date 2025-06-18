/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {}
  /** Preferences accessible in the `create` command */
  export type Create = ExtensionPreferences & {}
  /** Preferences accessible in the `recent-issues` command */
  export type RecentIssues = ExtensionPreferences & {}
  /** Preferences accessible in the `add-workspace` command */
  export type AddWorkspace = ExtensionPreferences & {}
  /** Preferences accessible in the `manage-workspaces` command */
  export type ManageWorkspaces = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {
  /** thinkhuman Fix the bug */
  "text": string
}
  /** Arguments passed to the `create` command */
  export type Create = {}
  /** Arguments passed to the `recent-issues` command */
  export type RecentIssues = {}
  /** Arguments passed to the `add-workspace` command */
  export type AddWorkspace = {}
  /** Arguments passed to the `manage-workspaces` command */
  export type ManageWorkspaces = {}
}

