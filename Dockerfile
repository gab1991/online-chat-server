# Stage 1, build the project
FROM node:16.11-alpine as build
WORKDIR /app
RUN npm i -g pnpm
COPY package.json .
RUN pnpm install
COPY . .
RUN pnpm build
CMD [ "pnpm",  "start:prod" ]