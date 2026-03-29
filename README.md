# Keyboard Switcher — Raycast Extension

Расширение для [Raycast](https://raycast.com), которое управляет раскладками клавиатуры через CLI-утилиту [keyboardSwitcher](https://github.com/nicklockwood/keyboardSwitcher).

Главная фишка — создание **Quicklink** для любой раскладки и назначение ему хоткея в настройках Raycast. Получается мгновенное переключение раскладки одной клавишей, без открытия какого-либо UI.

---

## Требования

- macOS
- [Raycast](https://raycast.com) (бесплатная версия подходит)
- [`keyboardSwitcher`](https://github.com/nicklockwood/keyboardSwitcher) — установить через Homebrew:

```bash
brew install nicklockwood/utils/keyboardswitcher
```

---

## Установка расширения

```bash
git clone <repo-url> keyboard-switcher-extension
cd keyboard-switcher-extension
npm install
npm run dev
```

Raycast подхватит расширение в режиме разработки. Для постоянной установки используйте `npm run build`.

---

## Команды

### 1. List Enabled Keyboard Layouts

Показывает список **включённых** раскладок (те, что видны в системном меню macOS).

| Действие | Горячая клавиша | Описание |
|---|---|---|
| Select Layout | `↵ Enter` | Переключиться на эту раскладку |
| Create Quicklink | `Cmd+Shift+L` | Создать quicklink для привязки к хоткею |
| Disable Layout | `Ctrl+X` | Убрать раскладку из списка включённых |
| Refresh | `Cmd+R` | Обновить список |

> **Как назначить хоткей на раскладку:**
> 1. Откройте команду, нажмите `Create Quicklink` на нужной раскладке
> 2. В Raycast Settings → Extensions → Quicklinks найдите созданный quicklink
> 3. Назначьте ему горячую клавишу
> 4. Теперь нажатие этой клавиши мгновенно переключает раскладку

---

### 2. List All Keyboard Layouts

Показывает **все** доступные на Mac раскладки. Включённые отмечены зелёным тегом `enabled`.

| Действие | Горячая клавиша | Описание |
|---|---|---|
| Select Layout | `↵ Enter` | Переключиться (включит автоматически, если нужно) |
| Enable Layout | `Cmd+E` | Добавить раскладку в список включённых |
| Disable Layout | `Ctrl+X` | Убрать из включённых |
| Create Quicklink | `Cmd+Shift+L` | Создать quicklink для хоткея |
| Refresh | `Cmd+R` | Обновить список |

---

### 3. Select Keyboard Layout *(no-view)*

Служебная команда, которая **переключает раскладку без открытия UI**. Принимает ID раскладки как аргумент.

Используется как цель для Quicklink-ов, созданных командами 1 и 2.

**Формат deeplink:**
```
raycast://extensions/bogdan/keyboard-switcher/select-layout?arguments={"layout":"com.apple.keylayout.British-PC"}
```

---

## Настройки

В `Raycast Settings → Extensions → Keyboard Switcher` доступен параметр:

| Параметр | По умолчанию | Описание |
|---|---|---|
| keyboardSwitcher Path | `/opt/homebrew/bin/keyboardSwitcher` | Путь до бинарника, если установлен не через Homebrew |

Если бинарник не найден по указанному пути, расширение автоматически проверит `/usr/local/bin/keyboardSwitcher` и результат `which keyboardSwitcher`.

---

## Как это работает

```
List Enabled (команда 1)
    │
    └─ Create Quicklink ──▶ Quicklink в Raycast (можно назначить хоткей)
                                    │
                                    ▼ активация хоткея
                            select-layout (команда 3, no-view)
                                    │
                                    ▼
                            keyboardSwitcher select <id>
```

Расширение вызывает `keyboardSwitcher` через `execSync` — никаких фоновых процессов, никаких демонов. Каждая операция — простой shell-вызов.

---

## Структура проекта

```
keyboard-switcher-extension/
├── package.json          # Raycast манифест + npm
├── tsconfig.json
├── src/
│   ├── list-enabled.tsx  # Команда 1 — включённые раскладки
│   ├── list-all.tsx      # Команда 2 — все раскладки
│   ├── select-layout.tsx # Команда 3 — переключение по аргументу (no-view)
│   └── utils.ts          # findBinary, runCLI, parseLayouts
└── assets/
    └── command-icon.png
```
