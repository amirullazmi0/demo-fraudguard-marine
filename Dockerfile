FROM node:22-alpine

WORKDIR /app

ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/build_placeholder?schema=public

RUN apk add --no-cache libc6-compat

RUN corepack enable

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate

RUN yarn build

EXPOSE 3001

ENV HOSTNAME=0.0.0.0
ENV PORT=3001

CMD ["sh", "-c", "yarn start -H 0.0.0.0 -p ${PORT}"]