# API Super4 (REST)

Servicio REST para exponer sucursales y productos del supermercado 4.

## Stack

- Java 17
- Spring Boot
- SQL Server

## Puerto y URL base

- Puerto: `8084`
- Base URL: `http://localhost:8084/api/v1`

Endpoints:

- `GET /supermercado/sucursales`
- `GET /supermercado/productos`

## Seguridad

La API usa autenticación HTTP Basic.

- Usuario: `disco`
- Password: `n0h2e9f`

## Pruebas rápidas

```bash
curl -u disco:n0h2e9f http://localhost:8084/api/v1/supermercado/sucursales
curl -u disco:n0h2e9f http://localhost:8084/api/v1/supermercado/productos
```

## Desarrollo local

```bash
./mvnw spring-boot:run
```

Con Docker (desde raíz del monorepo):

```bash
docker compose -f docker/dev/docker-compose.yml up -d api-super4
```
