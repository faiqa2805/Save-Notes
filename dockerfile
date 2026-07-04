# Use a lightweight, stable Node environment
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy dependency manifests first to leverage Docker's cache layer
COPY package*.json ./

# Install only production dependencies to keep the image lightweight
RUN npm ci --only=production

# Copy the rest of your application source code
COPY . .

# Expose the internal port your Express server listens on
EXPOSE 3000

# Run the application
CMD ["node", "app.js"]