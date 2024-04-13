# base image
FROM node:alpine3.11

WORKDIR /app

COPY . .

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN npm install --production
RUN apk --no-cache add --virtual .build-deps \
        build-base \
    && apk del .build-deps

EXPOSE 5002
# start app
CMD ["npm", "start"]

# # Build stage
# FROM node:14-alpine3.11 
# WORKDIR /app

# RUN npm install --production
# RUN apk --no-cache add --virtual .build-deps \
#         build-base \
#     && apk del .build-deps
# COPY . .

# ENV PATH /app/node_modules/.bin:$PATH
# CMD ["npm", "start"]
