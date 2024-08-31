FROM node:alpine

ARG DATABASE_URL

COPY ./package.json /usr/src/app/package.json
COPY ./package-lock.json /usr/src/app/package-lock.json
COPY ./turbo.json /usr/src/app/turbo.json
COPY ./packages /usr/src/app/packages
COPY ./apps/boilerplate-generator /usr/src/app/apps/boilerplate-generator
COPY ./apps/problems /usr/src/app/apps/problems

WORKDIR /usr/src/app

RUN npm install

RUN  cd ./apps/boilerplate-generator && PROBLEMS_DIR_PATH=/usr/src/app/apps/problems PV_DIR_PATH=/dev/problems npm run start

WORKDIR /usr/src/app

RUN cd ./packages/db && DATABASE_URL=$DATABASE_URL npx prisma generate && DATABASE_URL=$DATABASE_URL MOUNT_PATH=/usr/src/app/apps/problems npx prisma db seed

WORKDIR /usr/src/app