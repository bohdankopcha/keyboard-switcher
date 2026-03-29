/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** keyboardSwitcher Path - Full path to the keyboardSwitcher binary */
  "binaryPath": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `list-all` command */
  export type ListAll = ExtensionPreferences & {}
  /** Preferences accessible in the `select-layout` command */
  export type SelectLayout = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `list-all` command */
  export type ListAll = {}
  /** Arguments passed to the `select-layout` command */
  export type SelectLayout = {
  /** Layout ID */
  "layout": string
}
}

