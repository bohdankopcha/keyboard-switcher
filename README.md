# Keyboard Switcher — Raycast Extension

Расширение для [Raycast](https://raycast.com), которое управляет раскладками клавиатуры через CLI-утилиту [keyboardSwitcher](https://github.com/nicklockwood/keyboardSwitcher).

Главная фишка — создание **Quicklink** для любой включённой раскладки и назначение ему хоткея в настройках Raycast. Получается мгновенное переключение раскладки одной клавишей, без открытия какого-либо UI.

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

### 1. List All Keyboard Layouts

Основная команда. Показывает все доступные на Mac раскладки. Включённые отмечены зелёным тегом `enabled`.

В правой части поисковой строки — фильтр:
- **All** — все раскладки
- **Enabled** — только включённые

**Действия на включённой раскладке:**

| Действие | Горячая клавиша | Описание |
|---|---|---|
| Select Layout | `↵ Enter` | Переключиться на эту раскладку |
| Create Quicklink | `Cmd+Shift+L` | Создать quicklink для привязки к хоткею |
| Disable Layout | `Ctrl+X` | Убрать раскладку из системного списка |

**Действия на выключенной раскладке:**

| Действие | Горячая клавиша | Описание |
|---|---|---|
| Select Layout | `↵ Enter` | Включить и переключиться |
| Enable Layout | `Cmd+E` | Добавить раскладку в системный список |

---

### 2. Select Keyboard Layout *(no-view)*

Служебная команда — переключает раскладку по ID **без открытия UI**. Используется как цель для quicklink-ов.

Напрямую вызывать не нужно — она работает в фоне, когда срабатывает quicklink.

---

## Как назначить хоткей на раскладку

1. Откройте **List All Keyboard Layouts**
2. Найдите нужную включённую раскладку (зелёный тег `enabled`)
3. Нажмите `Cmd+K` → **Create Quicklink**
4. В Raycast откроется диалог создания quicklink — подтвердите
5. Перейдите в **Raycast Settings → Extensions → Quicklinks**
6. Найдите созданный quicklink и назначьте ему горячую клавишу
7. Готово — теперь нажатие этой клавиши мгновенно переключает раскладку

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
List All Keyboard Layouts
    │
    └─ Create Quicklink (на включённой раскладке)
            │
            ▼
        Quicklink в Raycast → назначить хоткей
            │
            ▼ нажатие хоткея
        select-layout (no-view, без UI)
            │
            ▼
        keyboardSwitcher select <id>
```

Расширение вызывает `keyboardSwitcher` через `execSync` — никаких фоновых процессов, никаких демонов.

---

## Структура проекта

```
keyboard-switcher-extension/
├── package.json          # Raycast манифест + npm
├── tsconfig.json
├── src/
│   ├── list-all.tsx      # Основная команда — все раскладки
│   ├── select-layout.tsx # Служебная команда для quicklink-ов (no-view)
│   └── utils.ts          # findBinary, runCLI, parseLayouts
└── assets/
    └── command-icon.png
```
