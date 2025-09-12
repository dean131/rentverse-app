# STAGE 1: Build the application
FROM node:22.18.0-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
# Note: Using npm install as per the scripts in your package.json
RUN npm install

# Copy the Prisma schema. This is needed to generate the client.
COPY prisma ./prisma

# Generate the Prisma Client
# THIS IS THE CRITICAL NEW STEP
RUN npx prisma generate

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

EXPOSE 8080
# The start command should use the compiled JS files in dist
CMD ["node", "dist/index.js"]