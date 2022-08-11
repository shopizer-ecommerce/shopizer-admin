FROM nginx:1.23.1-alpine

#WORKDIR /app

RUN ls -al

COPY dist /usr/share/nginx/html

# Copy Nginx Files
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE Port 80
# EXPOSE 80
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]