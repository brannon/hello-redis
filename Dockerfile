FROM node:9.5-alpine
RUN mkdir -p /app && \
    mkdir -p /app/html

WORKDIR /app

ADD package.json package-lock.json /app/
RUN npm install

ENTRYPOINT [ "npm", "start", "--"]

COPY public /app/public/
COPY app.js /app
