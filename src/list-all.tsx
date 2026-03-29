import { ActionPanel, Action, List, showToast, Toast, Icon, Color } from "@raycast/api";
import { useState, useEffect } from "react";
import { Layout, getAllLayouts, getEnabledLayouts, runCLI } from "./utils";

type Filter = "all" | "enabled";

export default function ListAll() {
  const [allLayouts, setAllLayouts] = useState<Layout[]>([]);
  const [enabledIds, setEnabledIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  function loadLayouts() {
    setIsLoading(true);
    try {
      const all = getAllLayouts();
      const enabled = getEnabledLayouts();
      setAllLayouts(all);
      setEnabledIds(new Set(enabled.map((l) => l.id)));
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

  async function enableLayout(layout: Layout) {
    const toast = await showToast({ style: Toast.Style.Animated, title: "Enabling layout…" });
    try {
      runCLI(["enable", layout.id]);
      toast.style = Toast.Style.Success;
      toast.title = `Enabled ${layout.name}`;
      loadLayouts();
    } catch (e) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to enable layout";
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

  async function selectLayout(layout: Layout) {
    const toast = await showToast({ style: Toast.Style.Animated, title: "Switching layout…" });
    try {
      if (!enabledIds.has(layout.id)) {
        runCLI(["enable", layout.id]);
      }
      runCLI(["select", layout.id]);
      toast.style = Toast.Style.Success;
      toast.title = `Switched to ${layout.name}`;
      loadLayouts();
    } catch (e) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to select layout";
      toast.message = e instanceof Error ? e.message : String(e);
    }
  }

  const visibleLayouts =
    filter === "enabled" ? allLayouts.filter((l) => enabledIds.has(l.id)) : allLayouts;

  const searchBarAccessory = (
    <List.Dropdown
      tooltip="Show"
      value={filter}
      onChange={(value) => setFilter(value as Filter)}
    >
      <List.Dropdown.Item title="All" value="all" />
      <List.Dropdown.Item title="Enabled" value="enabled" />
    </List.Dropdown>
  );

  if (error) {
    return (
      <List isLoading={false} searchBarAccessory={searchBarAccessory}>
        <List.EmptyView
          icon={{ source: Icon.ExclamationMark, tintColor: Color.Red }}
          title="Error"
          description={error}
        />
      </List>
    );
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Filter layouts…" searchBarAccessory={searchBarAccessory}>
      {visibleLayouts.map((layout) => {
        const isEnabled = enabledIds.has(layout.id);
        return (
          <List.Item
            key={layout.id}
            title={layout.name}
            subtitle={layout.id}
            icon={{
              source: Icon.Keyboard,
              tintColor: isEnabled ? Color.Green : Color.SecondaryText,
            }}
            accessories={isEnabled ? [{ tag: { value: "enabled", color: Color.Green } }] : []}
            actions={
              <ActionPanel>
                <Action
                  title="Select Layout"
                  icon={Icon.ArrowRight}
                  onAction={() => selectLayout(layout)}
                />
                {isEnabled ? (
                  <>
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
                  </>
                ) : (
                  <Action
                    title="Enable Layout"
                    icon={Icon.Plus}
                    shortcut={{ modifiers: ["cmd"], key: "e" }}
                    onAction={() => enableLayout(layout)}
                  />
                )}
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
