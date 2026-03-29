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
  /** Preferences accessible in the `quick-switch` command */
  export type QuickSwitch = ExtensionPreferences & {}
  /** Preferences accessible in the `switch-layout-1` command */
  export type SwitchLayout1 = ExtensionPreferences & {}
  /** Preferences accessible in the `switch-layout-2` command */
  export type SwitchLayout2 = ExtensionPreferences & {}
  /** Preferences accessible in the `switch-layout-3` command */
  export type SwitchLayout3 = ExtensionPreferences & {}
  /** Preferences accessible in the `switch-layout-4` command */
  export type SwitchLayout4 = ExtensionPreferences & {}
  /** Preferences accessible in the `switch-layout-5` command */
  export type SwitchLayout5 = ExtensionPreferences & {}
  /** Preferences accessible in the `switch-layout-6` command */
  export type SwitchLayout6 = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `list-all` command */
  export type ListAll = {}
  /** Arguments passed to the `quick-switch` command */
  export type QuickSwitch = {}
  /** Arguments passed to the `switch-layout-1` command */
  export type SwitchLayout1 = {}
  /** Arguments passed to the `switch-layout-2` command */
  export type SwitchLayout2 = {}
  /** Arguments passed to the `switch-layout-3` command */
  export type SwitchLayout3 = {}
  /** Arguments passed to the `switch-layout-4` command */
  export type SwitchLayout4 = {}
  /** Arguments passed to the `switch-layout-5` command */
  export type SwitchLayout5 = {}
  /** Arguments passed to the `switch-layout-6` command */
  export type SwitchLayout6 = {}
}

