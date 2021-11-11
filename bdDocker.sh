#!/usr/bin/env bash
#remove existing
docker rm -f meteora-postgres
docker rm -f pgadmin
docker system prune
#posgres
docker run --name meteora-postgres -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meteora-db -d postgres:14-alpine
#pgadmin 
docker run  --name pgadmin -p 5050:5050 -d thajeztah/pgadmin4
