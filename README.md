# shopizer-admin

npm i --yes
ng serve -o

docker run \
-e "APP_BASE_URL=http://aws-demo.shopizer.com:8080/" \
-it --rm -p 80:80 shopizerecomm/shopizer-admin
