FROM node:18

# pnpm 설치
# RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /react

COPY .env .env

COPY . .

RUN npm install

CMD ["npm", "run", "build"]
