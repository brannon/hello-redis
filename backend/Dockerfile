FROM node:9.5-alpine
RUN mkdir -p /app

WORKDIR /app

ADD package.json package-lock.json /app/
RUN npm install

ENTRYPOINT [ "npm", "start", "--"]

COPY app.js /app
