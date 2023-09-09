FROM node:lts-alpine AS builder
WORKDIR /app

RUN corepack enable&&corepack prepare pnpm@latest-8 --activate
COPY package.json pnpm-lock.yaml .npmrc ./
COPY . .
RUN pnpm i&&pnpm run build


FROM node:lts-alpine
WORKDIR /app
RUN corepack enable&&corepack prepare pnpm@latest-8 --activate


COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/.npmrc ./.npmrc

RUN pnpm install --prod --frozen-lockfile


EXPOSE 3000

CMD ["node", "server.js"]
