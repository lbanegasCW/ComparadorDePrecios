# Client (Angular)

Frontend del comparador de precios, con soporte de internacionalización (español e inglés).

## Stack

- Angular 18
- TypeScript
- TailwindCSS

## Requisitos locales (sin Docker)

- Node.js 18+
- npm

## Scripts principales

```bash
npm install
npm run start:es     # http://localhost:4200
npm run start:en     # http://localhost:4201
npm run build
npm run build:i18n
npm run test
npm run extract-i18n
```

## Desarrollo con Docker

Desde la raíz del monorepo:

```bash
docker compose -f docker/dev/docker-compose.yml up -d client-es client-en
```

## Configuración de entornos locales

- ES: `ng serve --configuration=es-AR --port 4200`
- EN: `ng serve --configuration=en --port 4201`

## Integración con backend

El cliente consume la API principal (`api-indec`) en desarrollo, por lo que se recomienda levantar también:

```bash
docker compose -f docker/dev/docker-compose.yml up -d api-indec
```
