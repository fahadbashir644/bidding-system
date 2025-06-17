FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8088

# Start the server using the production build
CMD [ "npm", "start" ]
