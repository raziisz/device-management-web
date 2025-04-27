
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
COPY angular.json ./

RUN npm install -g @angular/cli@19.2.9

RUN npm install

COPY . .

RUN ng build --configuration=production

FROM nginx:1.28.0-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/device-management-web/browser /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
