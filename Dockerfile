FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install serve -g
RUN npm install -g create-vite
RUN npm install -g vite
RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["serve", "-s", "dist", "-p", "8000"]