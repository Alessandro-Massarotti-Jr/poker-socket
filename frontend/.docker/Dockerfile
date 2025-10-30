# Build stage
FROM node:24-alpine AS build
RUN  npm install -g @angular/cli
WORKDIR /home/node/app
COPY package*.json ./
RUN npm ci
COPY ./ .
RUN npm run build

# production Stage
FROM nginx:alpine
COPY --from=build /home/node/app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]