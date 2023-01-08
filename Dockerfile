FROM node:14.15.1-alpine3.12

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY ./ .

EXPOSE 4000

CMD ["npm", "start"]