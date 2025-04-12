FROM node:18
WORKDIR /react
COPY . .
RUN pnpm install
CMD pnpm run dev -- --host
