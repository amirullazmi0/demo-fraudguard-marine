FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3001

ENV HOSTNAME=0.0.0.0
ENV PORT=3001

CMD ["sh", "-c", "npm run start -- -H 0.0.0.0 -p ${PORT}"]