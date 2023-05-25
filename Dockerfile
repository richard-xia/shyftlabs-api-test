FROM node:16

WORKDIR /src

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY . .

RUN npm install
RUN npx prisma generate
# RUN node src/script.js

EXPOSE 4000
CMD [ "node", "src/index.js" ]
