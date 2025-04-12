FROM node:18

# pnpm 설치
# RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /react

COPY . .

RUN npm install

CMD ["npm", "run", "dev", "--", "--host"]
