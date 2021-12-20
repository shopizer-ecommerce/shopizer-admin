# Shopizer Administration (shopizer-admin) Angular web app

## Tested with node v12.22.7

Requires Angular cli installed (npm install -g @angular/cli@latest)

## Run locally

npm i --yes
ng serve -o
http://localhost:4200

## Build app
ng build 

## Run docker images

Assumes your backend runs on http://localhost:8080

```
docker run \
-e "APP_BASE_URL=http://localhost:8080/api" \
-it --rm -p 80:80 shopizerecomm/shopizer-admin
```

Username: admin@shopizer.com
Password: password
