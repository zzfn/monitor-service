FROM node:lts-alpine
WORKDIR /app

COPY public ./public
COPY .next/standalone ./

ENV TZ="Asia/Shanghai"
EXPOSE 3000

CMD ["node", "server.js"]
