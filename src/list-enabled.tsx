import { ActionPanel, Action, List, showToast, Toast, Icon, Color } from "@raycast/api";
import { useState, useEffect } from "react";
import { Layout, getEnabledLayouts, runCLI } from "./utils";

export default function ListEnabled() {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function loadLayouts() {
    setIsLoading(true);
    try {
      setLayouts(getEnabledLayouts());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLayouts();
  }, []);

  async function selectLayout(layout: Layout) {
    const toast = await showToast({ style: Toast.Style.Animated, title: "Switching layout…" });
    try {
      runCLI(["select", layout.id]);
      toast.style = Toast.Style.Success;
      toast.title = `Switched to ${layout.name}`;
    } catch (e) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to switch layout";
      toast.message = e instanceof Error ? e.message : String(e);
    }
  }

  async function disableLayout(layout: Layout) {
    const toast = await showToast({ style: Toast.Style.Animated, title: "Disabling layout…" });
    try {
      runCLI(["disable", layout.id]);
      toast.style = Toast.Style.Success;
      toast.title = `Disabled ${layout.name}`;
      loadLayouts();
    } catch (e) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to disable layout";
      toast.message = e instanceof Error ? e.message : String(e);
    }
  }

  if (error) {
    return (
      <List isLoading={false}>
        <List.EmptyView icon={{ source: Icon.ExclamationMark, tintColor: Color.Red }} title="Error" description={error} />
      </List>
    );
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Filter enabled layouts…">
      {layouts.map((layout) => (
        <List.Item
          key={layout.id}
          title={layout.name}
          subtitle={layout.id}
          icon={{ source: Icon.Keyboard }}
          actions={
            <ActionPanel>
              <Action
                title="Select Layout"
                icon={Icon.ArrowRight}
                onAction={() => selectLayout(layout)}
              />
              <Action.CreateQuicklink
                title="Create Quicklink"
                quicklink={{
                  name: `Switch to ${layout.name}`,
                  link: `raycast://extensions/bogdan/keyboard-switcher/select-layout?arguments=${encodeURIComponent(JSON.stringify({ layout: layout.id }))}`,
                }}
              />
              <Action
                title="Disable Layout"
                icon={Icon.Trash}
                style={Action.Style.Destructive}
                shortcut={{ modifiers: ["ctrl"], key: "x" }}
                onAction={() => disableLayout(layout)}
              />
              <Action
                title="Refresh"
                icon={Icon.ArrowClockwise}
                shortcut={{ modifiers: ["cmd"], key: "r" }}
                onAction={loadLayouts}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
