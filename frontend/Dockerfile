FROM node:18-alpine as builder
WORKDIR /app

# Copy only package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the frontend source code
COPY . .

# Build the production-ready app
RUN npm run build

# Expose port 3000 in the container
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
