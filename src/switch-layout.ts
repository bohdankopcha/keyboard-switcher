import { closeMainWindow, environment, LocalStorage, popToRoot, showHUD } from "@raycast/api";
import { runCLI } from "./utils";

export const SLOT_KEYS = ["switch-layout-1", "switch-layout-2", "switch-layout-3"] as const;

export interface SlotData {
  name: string;
  id: string;
}

export async function getSlot(key: string): Promise<SlotData | null> {
  const raw = await LocalStorage.getItem<string>(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SlotData;
  } catch {
    return null;
  }
}

export async function setSlot(key: string, data: SlotData): Promise<void> {
  await LocalStorage.setItem(key, JSON.stringify(data));
}

export async function clearSlot(key: string): Promise<void> {
  await LocalStorage.removeItem(key);
}

export default async function SwitchLayout() {
  const slotKey = environment.commandName;
  const slot = await getSlot(slotKey);

  if (!slot) {
    await showHUD("⚠ Slot not configured — assign a layout in List All Keyboard Layouts");
    return;
  }

  try {
    runCLI(["select", slot.id]);
    await closeMainWindow({ clearRootSearch: true });
    await popToRoot({ clearSearchBar: true });
    await showHUD(`Switched to ${slot.name}`);
  } catch (error) {
    await showHUD(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
