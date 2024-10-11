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


# Copy app source code
COPY . .


COPY prisma ./prisma

# RUN npx prisma migrate dev --name init
RUN npx prisma generate
# # Generate Prisma client

CMD ["npm", "run", "backend"]

