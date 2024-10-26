# Use a Node.js base image (version 18)
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port (default 8080)
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start:prod"]
