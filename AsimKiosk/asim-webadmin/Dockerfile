# Use the official Node.js 18 image as a base
FROM node:18

# Create and set the working directory for the app
WORKDIR /app

RUN npm install -g serve

COPY package*.json ./

RUN yarn install

COPY . .

ARG APIURL
ARG HUBURL

ENV VITE_BASE_URL=$APIURL
ENV VITE_HUB_ADDRESS=$HUBURL

RUN yarn build

ENV PORT=80

EXPOSE 80

CMD ["sh", "-c", "serve -s dist"]