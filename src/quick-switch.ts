import { closeMainWindow, LaunchProps, popToRoot, showHUD } from "@raycast/api";
import { runCLI } from "./utils";

interface LaunchContext {
  name: string;
  id: string;
}

export default async function QuickSwitch(props: LaunchProps<{ launchContext: LaunchContext }>) {
  const ctx = props.launchContext;

  if (!ctx?.id) {
    await showHUD("⚠ No layout specified — create a Quicklink from List All Keyboard Layouts");
    return;
  }

  try {
    runCLI(["select", ctx.id]);
    await closeMainWindow({ clearRootSearch: true });
    await popToRoot({ clearSearchBar: true });
    await showHUD(`Switched to ${ctx.name || ctx.id}`);
  } catch (error) {
    await showHUD(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
