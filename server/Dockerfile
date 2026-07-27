FROM node:21-bullseye

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends redis-server \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN chmod +x start.sh

ENV PORT=3000
EXPOSE 3000

CMD ["./start.sh"]
