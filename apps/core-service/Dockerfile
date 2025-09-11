# STAGE 1: Build the application
FROM node:22.18.0-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code into JavaScript
RUN npm run build

# STAGE 2: Create the production image
FROM node:22.18.0-alpine
WORKDIR /app

# Copy built code and dependencies from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy Prisma schema needed by the client to run migrations
COPY prisma ./prisma

EXPOSE 8080
CMD ["npm", "run", "start"]

