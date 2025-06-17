FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run build

# Use a minimal web server to serve the React app
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 5173

# Command to run the web server
CMD ["nginx", "-g", "daemon off;"]

##For localhost
# CMD ["npm", "run", "dev", "--", "--host"]