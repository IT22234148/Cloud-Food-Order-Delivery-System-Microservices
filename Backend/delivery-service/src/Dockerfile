# Use Node.js official image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the app's port
EXPOSE 5002

# Command to run the app
CMD ["npm", "start"]
