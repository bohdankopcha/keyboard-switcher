import { ActionPanel, Action, List, showToast, Toast, Icon, Color, Keyboard } from "@raycast/api";
import { useState, useEffect, useCallback } from "react";
import { Layout, getAllLayouts, getEnabledLayouts, runCLI } from "./utils";
import { SLOT_KEYS, SlotData, getSlot, setSlot, clearSlot } from "./switch-layout";

type Filter = "all" | "enabled";

const SLOT_LABELS = ["Layout 1", "Layout 2", "Layout 3"];
const SLOT_SHORTCUTS: Keyboard.Shortcut[] = [
  { modifiers: ["cmd"], key: "1" },
  { modifiers: ["cmd"], key: "2" },
  { modifiers: ["cmd"], key: "3" },
];

export default function ListAll() {
  const [allLayouts, setAllLayouts] = useState<Layout[]>([]);
  const [enabledIds, setEnabledIds] = useState<Set<string>>(new Set());
  const [slots, setSlots] = useState<(SlotData | null)[]>([null, null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const loadSlots = useCallback(async () => {
    const loaded = await Promise.all(SLOT_KEYS.map((key) => getSlot(key)));
    setSlots(loaded);
  }, []);

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
    loadSlots();
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

  async function assignToSlot(slotIndex: number, layout: Layout) {
    await setSlot(SLOT_KEYS[slotIndex], { name: layout.name, id: layout.id });
    await loadSlots();
    await showToast({
      style: Toast.Style.Success,
      title: `${SLOT_LABELS[slotIndex]} → ${layout.name}`,
      message: "Enable the command in Raycast settings and assign a hotkey",
    });
  }

  async function unassignSlot(slotIndex: number) {
    await clearSlot(SLOT_KEYS[slotIndex]);
    await loadSlots();
    await showToast({ style: Toast.Style.Success, title: `${SLOT_LABELS[slotIndex]} cleared` });
  }

  function getSlotTags(layoutId: string) {
    const tags: { value: string; color: Color }[] = [];
    slots.forEach((s, i) => {
      if (s?.id === layoutId) {
        tags.push({ value: `Slot ${i + 1}`, color: Color.Blue });
      }
    });
    return tags;
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
        const slotTags = getSlotTags(layout.id);
        const accessories = [
          ...slotTags.map((t) => ({ tag: t })),
          ...(isEnabled ? [{ tag: { value: "enabled", color: Color.Green } }] : []),
        ];

        return (
          <List.Item
            key={layout.id}
            title={layout.name}
            subtitle={layout.id}
            icon={{
              source: Icon.Keyboard,
              tintColor: isEnabled ? Color.Green : Color.SecondaryText,
            }}
            accessories={accessories}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action
                    title="Select Layout"
                    icon={Icon.ArrowRight}
                    onAction={() => selectLayout(layout)}
                  />
                </ActionPanel.Section>
                <ActionPanel.Section title="Assign to Slot">
                  {SLOT_KEYS.map((key, i) => {
                    const current = slots[i];
                    const isAssigned = current?.id === layout.id;
                    return isAssigned ? (
                      <Action
                        key={key}
                        title={`Clear ${SLOT_LABELS[i]} (${current.name})`}
                        icon={Icon.XMarkCircle}
                        shortcut={SLOT_SHORTCUTS[i]}
                        onAction={() => unassignSlot(i)}
                      />
                    ) : (
                      <Action
                        key={key}
                        title={current ? `${SLOT_LABELS[i]}: ${current.name} → ${layout.name}` : `Assign to ${SLOT_LABELS[i]}`}
                        icon={Icon.Pin}
                        shortcut={SLOT_SHORTCUTS[i]}
                        onAction={() => assignToSlot(i, layout)}
                      />
                    );
                  })}
                </ActionPanel.Section>
                <ActionPanel.Section>
                  {isEnabled ? (
                    <Action
                      title="Disable Layout"
                      icon={Icon.Trash}
                      style={Action.Style.Destructive}
                      shortcut={{ modifiers: ["ctrl"], key: "x" }}
                      onAction={() => disableLayout(layout)}
                    />
                  ) : (
                    <Action
                      title="Enable Layout"
                      icon={Icon.Plus}
                      shortcut={{ modifiers: ["cmd"], key: "e" }}
                      onAction={() => enableLayout(layout)}
                    />
                  )}
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
