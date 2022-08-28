FROM node:14.0.0
# Create app directory inside docker file
WORKDIR /usr/src/app
COPY package*.json ./
# Bundle app source code
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]