FROM nginx:alpine

## Remove default nginx index page

RUN rm -rf /usr/share/nginx/html/*

COPY dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]