FROM nginx:1.12-alpine
RUN mkdir -p /app && \
    mkdir -p /app/public

WORKDIR /app

COPY public /app/public/
COPY nginx.conf /etc/nginx/nginx.conf
