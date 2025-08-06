# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build TypeScript files
RUN npm run build

# Expose the port (match what you use in your app)
EXPOSE 443

# Start the server
CMD ["node", "dist/index.js"]
