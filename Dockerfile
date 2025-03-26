FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
# Copy the rest of the application code
COPY . .
COPY .env .env
RUN npm run build
EXPOSE 4000

# Command to run the application
CMD ["npm", "run", "dev"]
