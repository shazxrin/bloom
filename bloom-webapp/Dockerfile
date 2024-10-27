FROM node:current-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json /app
COPY pnpm-lock.yaml /app

RUN pnpm install

COPY build/server /app/build/server
COPY build/client /app/build/client

EXPOSE 3000

ENTRYPOINT ["pnpm", "run", "start"]
