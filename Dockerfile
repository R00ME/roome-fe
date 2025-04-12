FROM node:18

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /react

COPY . .

RUN pnpm install

CMD ["pnpm", "run", "dev", "--", "--host"]
