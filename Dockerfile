# build env
FROM node:10

WORKDIR /app

# Copy project files to the docker image
COPY package.json /app/package.json
#COPY . .

# install angular/cli globally (latest version, change this to the version you are using)
# RUN yarn global add @angular/cli@latest

# if you prefer npm, replace the above command with
RUN npm install @angular/cli@9.0.4 -g

# install packages
#RUN yarn install

# FOR NPM
RUN npm install

# Build Angular Application in Production
RUN ng build --prod

#### STAGE 2
#### Deploying the application

FROM nginx:alpine

VOLUME  /var/cache/nginx

# Copy the build files from the project
# replace "angular-docker-environment-variables" with your angular project name
COPY --from=builder /app/dist/angular-docker-environment-variables /usr/share/nginx/html

# Copy Nginx Files
COPY --from=builder /app/.docker/.config/nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE Port 80
EXPOSE 80