FROM node:20-alpine

ARG DATABASE_URL
ARG REDIS_URL

# Install g++ compiler
RUN apk add --no-cache g++

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the entire monorepo into the container
COPY ../../packages /usr/src/app/packages
COPY ../../apps/worker-compiler /usr/src/app/apps/worker-compiler
COPY ../../package.json /usr/src/app/package.json
COPY ../../turbo.json /usr/src/app/turbo.json

# Install dependencies
RUN npm install

# Generate Prisma client
RUN cd packages/db && DATABASE_URL=$DATABASE_URL npx prisma generate

WORKDIR /usr/src/app/apps/worker-compiler

# Command to start both services
RUN  npm run build
CMD ["npm", "run", "start"]
