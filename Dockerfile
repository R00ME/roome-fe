FROM node:18
WORKDIR /
COPY . .
RUN npm install -g serve
CMD serve -s build
