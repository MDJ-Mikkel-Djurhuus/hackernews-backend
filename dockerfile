FROM node:boron

# Create app directory
RUN mkdir -p /src/app

WORKDIR /src/app

# Bundle app source
COPY . .

RUN npm install

CMD [ "npm", "start" ]

EXPOSE 3000