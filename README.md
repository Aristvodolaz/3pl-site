# 3PL Inventory Dashboard

Современный веб-интерфейс для управления дашбордом размещенного товара, построенный на React с TypeScript.

## 🚀 Возможности

- **Таблица товаров** с полной информацией о размещенных товарах
- **Фильтрация и поиск** по различным критериям
- **Сортировка** по всем колонкам таблицы
- **Пагинация** для эффективной работы с большими объемами данных
- **Экспорт в Excel** отфильтрованных данных
- **Темная тема** для комфортной работы
- **Адаптивный дизайн** для работы на всех устройствах

## 🛠 Технологии

- **React 18** с TypeScript
- **TailwindCSS** для стилизации
- **Axios** для HTTP запросов
- **SheetJS (xlsx)** для экспорта в Excel
- **Feature-Sliced Design** архитектура

## 📦 Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd 3pl-inventory-dashboard

# Установить зависимости
npm install

# Запустить в режиме разработки
npm start
```

## 🔧 Конфигурация

### API Endpoint
По умолчанию приложение использует `http://localhost:8080` как базовый URL для API.

Для изменения создайте файл `.env` в корне проекта:
```env
REACT_APP_API_BASE_URL=http://your-api-server.com
```

### API Формат
Приложение ожидает API endpoint `GET /x3pl/razmeshennye` который возвращает:

```typescript
{
  success: boolean,
  errorCode: number,
  value: {
    items: Array<{
      shk: string,
      name: string,
      wrShk: string | null,
      wrName: string | null,
      kolvo: number,
      condition: string,
      reason: string | null
    }>
  }
}
```

## 🏗 Архитектура

Проект использует Feature-Sliced Design (FSD):

```
src/
├── app/           # Настройка приложения
├── pages/         # Страницы
├── features/      # Бизнес-функции
│   └── inventory-table/
│       ├── ui/    # UI компоненты
│       ├── model/ # Бизнес-логика и типы
│       └── lib/   # Утилиты
└── shared/        # Переиспользуемый код
    ├── ui/        # UI компоненты
    ├── api/       # API клиент
    ├── config/    # Конфигурация
    └── utils/     # Утилиты
```

## 🎯 Основные компоненты

### InventoryTable
Основная таблица с данными товаров, поддерживает сортировку и отображение различных состояний товаров.

### FilterPanel
Панель фильтров для поиска по ШК, наименованию, наименованию упаковки и состоянию товара.

### Pagination
Компонент пагинации с возможностью изменения размера страницы и навигации по страницам.

### ExportButton
Кнопка экспорта данных в Excel файл с настраиваемыми заголовками на русском языке.

## 📱 Адаптивность

Интерфейс полностью адаптивен и корректно отображается на:
- Десктопных компьютерах
- Планшетах
- Мобильных устройствах

## 🌙 Темная тема

Приложение поддерживает темную тему, которая:
- Автоматически определяется по системным настройкам
- Может быть переключена вручную
- Сохраняется в localStorage

## 🚀 Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в папке `build/`.

## 🧪 Разработка

```bash
# Запуск в режиме разработки
npm start

# Проверка линтером
npm run lint

# Исправление ошибок линтера
npm run lint:fix

# Форматирование кода
npm run format
```

## 📄 Лицензия

MIT License 