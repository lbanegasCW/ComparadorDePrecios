# API Super2 (REST)

Servicio REST para exponer sucursales y productos del supermercado 2.

## Stack

- Java 17
- Spring Boot
- SQL Server

## Puerto y URL base

- Puerto: `8082`
- Base URL: `http://localhost:8082/api/v1`

Endpoints:

- `GET /supermercado/sucursales`
- `GET /supermercado/productos`

## Seguridad

La API usa autenticación HTTP Basic.

- Usuario: `changoMas`
- Password: `c1h2s4f`

## Pruebas rápidas

```bash
curl -u changoMas:c1h2s4f http://localhost:8082/api/v1/supermercado/sucursales
curl -u changoMas:c1h2s4f http://localhost:8082/api/v1/supermercado/productos
```

## Desarrollo local

```bash
./mvnw spring-boot:run
```

Con Docker (desde raíz del monorepo):

```bash
docker compose -f docker/dev/docker-compose.yml up -d api-super2
```
