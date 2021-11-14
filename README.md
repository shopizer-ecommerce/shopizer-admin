# shopizer-admin Angular web app

## Run locally

npm i --yes
ng serve -o
http://localhost:4200

## Build app
ng build 

## Run docker images

docker run \
-e "APP_BASE_URL=http://localhost:8080/api" \
-it --rm -p 80:80 shopizerecomm/shopizer-admin
