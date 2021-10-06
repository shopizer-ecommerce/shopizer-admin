# shopizer-admin

## Run locally

npm i --yes
ng serve -o

## Build app
ng build 

## Run docker images

docker run \
-e "APP_BASE_URL=http://localhost:8080/api" \
-it --rm -p 80:80 shopizerecomm/shopizer-admin

APP_BASE_URL is the api backend
