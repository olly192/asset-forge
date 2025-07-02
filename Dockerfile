FROM oven/bun:latest

COPY ./build ./
COPY ./prisma ./prisma

RUN apt-get update -y && apt-get install -y openssl
RUN bun install
RUN bunx prisma generate
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "./index.js" ]
