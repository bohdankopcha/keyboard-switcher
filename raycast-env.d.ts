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
  /** Preferences accessible in the `switch-layout-1` command */
  export type SwitchLayout1 = ExtensionPreferences & {}
  /** Preferences accessible in the `switch-layout-2` command */
  export type SwitchLayout2 = ExtensionPreferences & {}
  /** Preferences accessible in the `switch-layout-3` command */
  export type SwitchLayout3 = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `list-all` command */
  export type ListAll = {}
  /** Arguments passed to the `switch-layout-1` command */
  export type SwitchLayout1 = {}
  /** Arguments passed to the `switch-layout-2` command */
  export type SwitchLayout2 = {}
  /** Arguments passed to the `switch-layout-3` command */
  export type SwitchLayout3 = {}
}

