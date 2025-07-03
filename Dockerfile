FROM node:20 AS build

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .
ENV PUBLIC_QR_PREFIX=""
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node:20 AS run

ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
EXPOSE 3000/tcp
RUN ulimit -c unlimited
ENTRYPOINT ["node", "build"]
