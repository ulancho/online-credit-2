## Разделение окружений

В проекте добавлена конфигурация для **prod / dev / local** через Vite env-файлы:

- `.env.production` — прод окружение.
- `.env.development` — dev/preprod окружение.
- `.env.development.local.example` — шаблон для локальной разработки.

Для локальной разработки:

1. Скопировать шаблон:

```bash
cp .env.development.local.example .env.development.local
```

2. Запустить проект:

```bash
npm run dev
```

По умолчанию `.env.development.local` использует относительные URL и Vite proxy.

## Основные переменные

- `VITE_API_BASE_URL` — базовый URL основного API.
- `VITE_DIRECTORY_BASE_URL` — базовый URL directory API.
- `VITE_DOCUMENTS_BASE_URL` — URL сервиса документов.
- `VITE_CLOSE_APP_URL` — URL закрытия webview.
- `VITE_EXTENDED_QUESTIONNAIRE_URL` — ссылка на расширенную анкету.
- `VITE_REFINANCING_APP_URL` — ссылка на рефинансирование.

Прокси для локалки:

- `VITE_PROXY_PRIVATE_CREDITS_TARGET`
- `VITE_PROXY_DIRECTORY_TARGET`
- `VITE_PROXY_DOCUMENTS_TARGET`
- `VITE_PROXY_CLOSE_TARGET`
- `VITE_PROXY_GATEWAY_TARGET`
