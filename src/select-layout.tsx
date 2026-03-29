import { showToast, Toast, LaunchProps } from "@raycast/api";
import { runCLI } from "./utils";

interface Arguments {
  layout: string;
}

export default async function SelectLayout(props: LaunchProps<{ arguments: Arguments }>) {
  const { layout } = props.arguments;

  if (!layout || !layout.trim()) {
    await showToast({
      style: Toast.Style.Failure,
      title: "No layout specified",
      message: "Provide a layout ID as the argument.",
    });
    return;
  }

  const toast = await showToast({
    style: Toast.Style.Animated,
    title: "Switching layout…",
    message: layout,
  });

  try {
    runCLI(["select", layout.trim()]);
    toast.style = Toast.Style.Success;
    toast.title = "Layout switched";
    toast.message = layout.trim();
  } catch (e) {
    toast.style = Toast.Style.Failure;
    toast.title = "Failed to switch layout";
    toast.message = e instanceof Error ? e.message : String(e);
  }
}
