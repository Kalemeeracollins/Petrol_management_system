# ---------- Base stage ----------
# Use an official Node runtime as the base image (alpine for smaller size)
FROM node:20-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first
# This allows Docker to cache dependencies unless these files change
COPY package*.json ./

# ---------- Dependencies stage ----------
FROM base AS deps
# Install production dependencies only (skip dev dependencies)
RUN npm ci --only=production && npm cache clean --force

# ---------- Builder stage (optional, for TypeScript or build steps) ----------
FROM base AS builder
# Copy the entire source code
COPY . .
# If you need to run a build step (e.g., TypeScript, Webpack), do it here
# RUN npm run build

# ---------- Production stage ----------
FROM node:20-alpine AS production

# Create a non-root user to run the app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy only the production dependencies from the deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy the application source (or the built artifacts) from the builder stage
COPY --from=builder --chown=nodejs:nodejs /app ./

# Switch to the non-root user
USER nodejs

# Expose the port your app listens on (adjust if needed)
EXPOSE 3000

# Define the command to run the app
CMD ["node", "server.js"]