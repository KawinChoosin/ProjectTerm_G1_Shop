# Use the official Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Run the app

# Copy Prisma schema
COPY prisma ./prisma

# Copy app source code
COPY . .


RUN npx prisma generate
# RUN npx prisma migrate dev --name init
# # Generate Prisma client

CMD ["node", "index.js"]

