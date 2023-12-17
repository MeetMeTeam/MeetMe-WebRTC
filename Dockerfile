# base image
FROM node:alpine3.11

WORKDIR /app

COPY . .

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN npm install


# start app
CMD ["npm", "start"]