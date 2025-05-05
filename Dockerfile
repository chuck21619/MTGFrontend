# Use node image to install dependencies for testing purposes
FROM node:23-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . ./

# Expose the port to be used by testing
EXPOSE 5173

# Run the frontend app using serve or similar tool for testing
CMD ["npm", "run", "dev", "--", "--host"]
