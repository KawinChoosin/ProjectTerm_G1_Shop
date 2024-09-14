# Use the official Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

# Expose the port the app runs on
EXPOSE 2222

# Run the app
CMD ["node", "index.js"]
