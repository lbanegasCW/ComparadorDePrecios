# ComparadorDePrecios

Monorepo del trabajo práctico **Comparador de Precios**, compuesto por APIs de supermercados (SOAP/REST), API integradora (INDEC), frontend Angular y base de datos SQL Server.

## Arquitectura del repositorio

- `api-indec/`: API principal que unifica y expone datos consolidados.
- `api-super1/`: API SOAP de supermercado 1.
- `api-super2/`: API REST de supermercado 2.
- `api-super3/`: API SOAP de supermercado 3.
- `api-super4/`: API REST de supermercado 4.
- `client/`: aplicación Angular (ES/EN).
- `db/`: scripts SQL y contenedor de SQL Server.
- `docker/dev/`: orquestación local con Docker Compose.

## Requisitos

- Docker
- Docker Compose (plugin `docker compose`)

> No hace falta instalar Java, Maven, Node o SQL Server localmente: se ejecutan dentro de contenedores.

## Levantar entorno de desarrollo

Desde la raíz del repo:

```bash
docker compose -f docker/dev/docker-compose.yml up -d --build
```

Para detener todo:

```bash
docker compose -f docker/dev/docker-compose.yml down
```

## Servicios y puertos

- API INDEC: `http://localhost:8080/api/v1`
- API Super1 (SOAP): `http://localhost:8081/ws`
- API Super2 (REST): `http://localhost:8082/api/v1`
- API Super3 (SOAP): `http://localhost:8083/ws`
- API Super4 (REST): `http://localhost:8084/api/v1`
- Cliente Angular ES: `http://localhost:4200`
- Cliente Angular EN: `http://localhost:4201`
- SQL Server: `localhost:1433`

## Comandos útiles

### Logs

```bash
docker compose -f docker/dev/docker-compose.yml logs -f api-indec
docker compose -f docker/dev/docker-compose.yml logs -f api-super1
docker compose -f docker/dev/docker-compose.yml logs -f api-super2
docker compose -f docker/dev/docker-compose.yml logs -f api-super3
docker compose -f docker/dev/docker-compose.yml logs -f api-super4
docker compose -f docker/dev/docker-compose.yml logs -f client-es
docker compose -f docker/dev/docker-compose.yml logs -f client-en
docker compose -f docker/dev/docker-compose.yml logs -f sqlserver
```

### Build/instalación dentro de contenedores

```bash
docker compose -f docker/dev/docker-compose.yml exec api-indec ./mvnw clean install
docker compose -f docker/dev/docker-compose.yml exec api-super1 ./mvnw clean install
docker compose -f docker/dev/docker-compose.yml exec api-super2 ./mvnw clean install
docker compose -f docker/dev/docker-compose.yml exec api-super3 ./mvnw clean install
docker compose -f docker/dev/docker-compose.yml exec api-super4 ./mvnw clean install
docker compose -f docker/dev/docker-compose.yml exec client-es npm install
```

## Base de datos

La inicialización de esquemas y datos se hace automáticamente con los scripts de `db/` cuando el contenedor se crea por primera vez.

Credenciales por defecto:

- Usuario: `sa`
- Password: `Admin123!`

## Debug remoto (Java)

- `api-indec`: `localhost:5005`
- `api-super1`: `localhost:5006`
- `api-super2`: `localhost:5007`
- `api-super3`: `localhost:5008`
- `api-super4`: `localhost:5009`

## README por módulo

Cada subproyecto tiene su README específico con:

- endpoints,
- credenciales de prueba,
- comandos locales,
- ejemplos de consumo.
