FROM node:20-alpine

ARG DATABASE_URL
# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the entire monorepo into the container
COPY ../../packages /usr/src/app/packages
COPY ../../apps/sweeper /usr/src/app/apps/sweeper
COPY ../../package.json /usr/src/app/package.json
COPY ../../turbo.json /usr/src/app/turbo.json



# Install dependencies
RUN npm install

# Generate Prisma client
RUN cd packages/db && DATABASE_URL=$DATABASE_URL npx prisma generate

WORKDIR /usr/src/app/apps/sweeper

# Command to start both services
RUN  npm run build
CMD ["npm", "run", "start"]
