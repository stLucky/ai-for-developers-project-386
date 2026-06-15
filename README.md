### Hexlet tests and linter status:
[![Actions Status](https://github.com/stLucky/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/stLucky/ai-for-developers-project-386/actions)

## Call Booking API Spec

### TypeSpec Specification

API-контракт описан в `main.tsp` с использованием TypeSpec.

### Доменные сущности

- **Owner** — владелец календаря (единственный профиль по умолчанию)
- **EventType** — тип события (название, описание, длительность)
- **Slot** — временной интервал для бронирования
- **Booking** — бронирование гостем

### Установка зависимостей

```bash
npm install
```

### Компиляция спецификации

```bash
npx tsp compile . --emit=@typespec/openapi3
```

Результат: `tsp-output/@typespec/openapi3/openapi.yaml`

### Просмотр документации

- Онлайн: [Swagger Editor](https://editor.swagger.io) — импортировать `openapi.yaml`
- Локально: `npx @redocly/cli build-docs tsp-output/@typespec/openapi3/openapi.yaml -o docs.html`
