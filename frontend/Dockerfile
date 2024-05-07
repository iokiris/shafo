FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# CMD ["npm", "run", "build"]
LABEL org.opencontainers.image.source https://github.com/iokiris/shafo
CMD ["npm", "start"]