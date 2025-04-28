FROM nginx:1.28.0-alpine

# Copia a build já feita
COPY ./dist/device-management-web/browser /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
