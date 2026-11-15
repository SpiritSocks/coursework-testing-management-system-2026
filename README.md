# Software Testing Management System

Software Testing Management System (STMS) — веб-приложение для управления
тестированием программных продуктов. Система позволяет хранить тестовую
документацию, объединять тест-кейсы в наборы и фиксировать результаты
выполнения тестов.

## Возможности

- создание и управление проектами;
- группировка тест-кейсов по наборам;
- создание, редактирование и просмотр тест-кейсов;
- хранение истории изменений тест-кейсов;
- формирование и выполнение тестовых прогонов;
- фиксация результатов прохождения тестов.

## Технологии

| Часть системы    | Технологии              |
| ---------------- | ----------------------- |
| Клиентская часть | React, TypeScript, Vite |
| Серверная часть  | ASP.NET Core, C#        |
| Работа с данными | Entity Framework Core   |
| База данных      | PostgreSQL 17           |
| Документация API | OpenAPI, Scalar         |

## Структура проекта

```text
Stms/
├── Stms-backend/       # REST API на ASP.NET Core
├── Stms-frontend/      # клиентское React-приложение
├── docker-compose.yml  # конфигурация PostgreSQL
└── README.md
```

## Требования

Для локального запуска необходимы:

- [Git](https://git-scm.com/);
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0);
- [Node.js](https://nodejs.org/) и npm;
- [Docker](https://www.docker.com/) с Docker Compose.

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/SpiritSocks/coursework-testing-management-system-2026.git
cd coursework-testing-management-system-2026
```

### 2. Запуск базы данных

Из корневого каталога проекта выполните:

```bash
docker compose up -d
```

Контейнер PostgreSQL будет доступен на порту `5433`. Данные сохраняются в Docker
volume и не удаляются при обычной остановке контейнера.

### 3. Подготовка базы данных

Перейдите в каталог backend:

```bash
cd Stms-backend/Stms-backend
dotnet restore
dotnet ef database update
```

Если команда `dotnet ef` не найдена, установите утилиту Entity Framework Core:

```bash
dotnet tool install --global dotnet-ef --version "10.*"
```

### 4. Запуск backend

Оставаясь в каталоге `Stms-backend/Stms-backend`, выполните:

```bash
dotnet run --launch-profile http
```

Backend будет доступен по адресу <http://localhost:5221>.

### 5. Запуск frontend

Откройте второй терминал и из корневого каталога проекта выполните:

```bash
cd Stms-frontend
npm install
npm run dev
```

После запуска откройте в браузере <http://localhost:5173>.

## Адреса сервисов

| Сервис                         | Адрес                             |
| ------------------------------ | --------------------------------- |
| Веб-интерфейс                  | <http://localhost:5173>           |
| REST API                       | <http://localhost:5221>           |
| Интерактивная документация API | <http://localhost:5221/scalar/v1> |
| PostgreSQL                     | `localhost:5433`                  |

В режиме разработки Vite автоматически перенаправляет запросы с `/api` на backend.

## Полезные команды

Сборка backend из корневого каталога:

```bash
dotnet build Stms-backend/Stms-backend.sln
```

Проверка и сборка frontend:

```bash
cd Stms-frontend
npm run lint
npm run build
```

Просмотр логов PostgreSQL:

```bash
docker compose logs -f postgres
```

Остановка базы данных:

```bash
docker compose down
```

## Конфигурация

Строка подключения к базе данных для режима разработки находится в
`Stms-backend/Stms-backend/appsettings.Development.json`. Параметры по умолчанию совпадают с
конфигурацией из `docker-compose.yml`.
