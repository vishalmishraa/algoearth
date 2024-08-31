FROM node:20-alpine

ARG DATABASE_URL
ARG REDIS_URL
# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the entire monorepo into the container
COPY ./packages /usr/src/app/packages
COPY ./apps/compiler /usr/src/app/apps/compiler
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
COPY turbo.json /usr/src/app/turbo.json


# Install dependencies
RUN npm install

# Generate Prisma client
RUN cd packages/db && DATABASE_URL=$DATABASE_URL REDIS_URL=$REDIS_URL npx prisma generate

# Expose ports for both applications
EXPOSE 3005

WORKDIR /usr/src/app/apps/compiler

# Command to start both services
RUN npm run build
CMD ["npm", "run","start"]
