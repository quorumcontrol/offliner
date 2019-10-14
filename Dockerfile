FROM node

# Create app directory
RUN mkdir -p /app
WORKDIR /app

RUN npm i -g ts-node

# Install app dependencies
COPY package.json /app
RUN yarn

COPY . /app

CMD "/bin/bash"
