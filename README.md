# Keyboard Switcher — Raycast Extension

Расширение для [Raycast](https://raycast.com), которое управляет раскладками клавиатуры через CLI-утилиту [keyboardSwitcher](https://github.com/nicklockwood/keyboardSwitcher).

Главная фишка — **мгновенное переключение раскладки по хоткею** без открытия окна Raycast. Назначьте раскладки на слоты прямо из списка (Cmd+1/2/3), включите нужные команды в Raycast и повесьте хоткеи.

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

| Команда | Режим | Описание |
|---|---|---|
| List All Keyboard Layouts | view | Все раскладки: включить/выключить/выбрать/назначить на слот |
| Switch to Layout 1 / 2 / 3 | no-view | Мгновенное переключение. Выключены по умолчанию. |

---

## Как назначить хоткей на раскладку

1. Откройте **List All Keyboard Layouts**
2. Найдите нужную раскладку и нажмите **Cmd+1** (или Cmd+2, Cmd+3) — раскладка назначится на слот
3. В **Raycast Settings → Extensions → Keyboard Switcher** включите соответствующую команду (Switch to Layout 1)
4. Назначьте ей хоткей
5. Готово — нажатие хоткея мгновенно переключает раскладку

---

## Горячие клавиши (в списке раскладок)

| Клавиша | Действие |
|---|---|
| `↵ Enter` | Переключиться на раскладку |
| `Cmd+1` | Назначить на Slot 1 (или убрать, если уже назначена) |
| `Cmd+2` | Назначить на Slot 2 |
| `Cmd+3` | Назначить на Slot 3 |
| `Cmd+E` | Включить раскладку |
| `Ctrl+X` | Отключить раскладку |

---

## Настройки

| Параметр | По умолчанию | Описание |
|---|---|---|
| keyboardSwitcher Path | `/opt/homebrew/bin/keyboardSwitcher` | Путь до бинарника |

---

## Структура проекта

```
keyboard-switcher-extension/
├── package.json
├── tsconfig.json
├── src/
│   ├── list-all.tsx          # Список раскладок + назначение слотов
│   ├── switch-layout.ts      # Общая логика переключения (LocalStorage)
│   ├── switch-layout-1.ts    # Слот 1
│   ├── switch-layout-2.ts    # Слот 2
│   ├── switch-layout-3.ts    # Слот 3
│   └── utils.ts              # findBinary, runCLI, parseLayouts
└── assets/
    └── command-icon.png
```
