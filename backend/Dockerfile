FROM node:18.17.1-alpine3.18

# create user
RUN addgroup -S backend_user && adduser -S backend_user -G backend_user

WORKDIR /backend_app

COPY package*.json ./
RUN npm install
COPY . .

RUN ["npm",  "run", "build"]

EXPOSE 8000
CMD ["npm",  "start"]

USER backend_user
