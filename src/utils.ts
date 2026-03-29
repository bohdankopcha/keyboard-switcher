import { execSync } from "child_process";
import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  binaryPath: string;
}

export interface Layout {
  name: string;
  id: string;
}

export function findBinary(): string {
  const prefs = getPreferenceValues<Preferences>();
  const candidates = [
    prefs.binaryPath,
    "/opt/homebrew/bin/keyboardSwitcher",
    "/usr/local/bin/keyboardSwitcher",
  ];

  for (const path of candidates) {
    if (!path) continue;
    try {
      execSync(`test -x "${path}"`, { stdio: "ignore" });
      return path;
    } catch {
      // not found or not executable — try next
    }
  }

  // Fall back to PATH resolution
  try {
    const resolved = execSync("which keyboardSwitcher", { encoding: "utf8" }).trim();
    if (resolved) return resolved;
  } catch {
    // ignore
  }

  throw new Error(
    "keyboardSwitcher binary not found. Install it or set the correct path in extension preferences.",
  );
}

export function parseLayouts(output: string): Layout[] {
  const seen = new Set<string>();
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      // Format: "British – PC (com.apple.keylayout.British-PC)"
      const match = line.match(/^(.+?)\s+\((.+)\)$/);
      if (!match) return null;
      return { name: match[1].trim(), id: match[2].trim() };
    })
    .filter((l): l is Layout => {
      if (l === null) return false;
      if (seen.has(l.id)) return false;
      seen.add(l.id);
      return true;
    });
}

export function runCLI(args: string[]): string {
  const binary = findBinary();
  const safeArgs = args.map((a) => `"${a.replace(/"/g, '\\"')}"`).join(" ");
  return execSync(`"${binary}" ${safeArgs}`, { encoding: "utf8" });
}

export function getEnabledLayouts(): Layout[] {
  const output = runCLI(["enabled"]);
  return parseLayouts(output);
}

export function getAllLayouts(): Layout[] {
  const output = runCLI(["list"]);
  return parseLayouts(output);
}
