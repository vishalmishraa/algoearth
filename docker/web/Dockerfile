FROM node:20-alpine

ARG MOUNT_PATH
ARG NEXTAUTH_SECRET
ARG JWT_SECRET
ARG DATABASE_URL
ARG REDIS_URL
ARG JUDGE0_URI

# Use ENV to set the environment variables inside the container
ENV MOUNT_PATH=${MOUNT_PATH} \
    NEXTAUTH_SECRET=${NEXTAUTH_SECRET} \
    JWT_SECRET=${JWT_SECRET} \
    DATABASE_URL=${DATABASE_URL} \
    REDIS_URL=${REDIS_URL} \
    JUDGE0_URI=${JUDGE0_URI}

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the entire monorepo into the container
COPY ../../packages /usr/src/app/packages
COPY ../../apps/web /usr/src/app/apps/sweeper
COPY ../../package.json /usr/src/app/package.json
COPY ../../turbo.json /usr/src/app/turbo.json

# Install dependencies
RUN npm install

# Generate Prisma client
RUN cd packages/db && DATABASE_URL=$DATABASE_URL npx prisma generate

# Expose ports for both applications
EXPOSE 3000

WORKDIR /usr/src/app/apps/web

# Command to start both services
RUN npm run build
CMD ["npm", "run", "start"]
