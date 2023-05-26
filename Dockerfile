FROM node:16

WORKDIR /src

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY api.test.js ./
COPY . .

RUN npm install
RUN npx prisma generate

EXPOSE 4000
CMD [ "node", "src/index.js" ]
