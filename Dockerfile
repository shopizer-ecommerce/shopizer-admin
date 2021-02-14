# build env
FROM node:13.12.0-alpine as builder

RUN mkdir -p /app

WORKDIR /app

COPY conf ./

COPY package.json /app
COPY package-lock.json  /app

RUN npm ci --silent
#must match package.json react-scripts
COPY . /app
RUN npm run build


# production env
FROM nginx:stable-alpine

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx


COPY --from=builder /app/shopizer-admin /usr/share/nginx/html