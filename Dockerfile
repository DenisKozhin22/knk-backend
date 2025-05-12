# Используем конкретную версию Node.js
FROM node:20-alpine

# Устанавливаем рабочую директорию как /app
WORKDIR /app

# Копируем только package.json и yarn.lock для установки зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем весь исходный код
COPY . .

# Строим проект
RUN yarn build

# Открываем порт 4000 для приложения
EXPOSE 4000

# Устанавливаем переменные окружения
ENV PORT=4000
ENV NODE_ENV=production

# Запускаем приложение из папки dist
CMD ["yarn", "start:prod"]