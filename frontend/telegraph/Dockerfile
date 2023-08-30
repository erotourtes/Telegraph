FROM node:18.17.1-alpine3.18

# create user
RUN addgroup -S frontend_user && adduser -S frontend_user -G frontend_user

WORKDIR /frontend_app

COPY package*.json ./
RUN npm install
COPY . .

RUN ["npm",  "run", "build"]

EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host"]

RUN chown -R frontend_user:frontend_user .
USER frontend_user
