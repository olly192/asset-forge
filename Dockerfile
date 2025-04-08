FROM oven/bun:latest

COPY ./build ./
COPY ./prisma ./prisma

RUN bun install
RUN bunx prisma generate
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "./index.js" ]
