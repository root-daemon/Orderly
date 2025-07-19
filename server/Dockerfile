FROM node:21-bullseye
RUN mkdir /app
WORKDIR /app
RUN npm install -g nodemon pm2

COPY ./package.json /app/package.json
RUN npm install
RUN npm install prisma --save-dev

COPY . /app

# Ensure prisma directory exists and has proper permissions
RUN mkdir -p /app/prisma && chmod 755 /app/prisma

RUN npx prisma generate --schema=./prisma/schema.prisma

CMD [ "pm2-runtime", "start", "index.js"]