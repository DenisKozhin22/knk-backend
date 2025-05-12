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

# Генерируем Prisma клиент
RUN yarn prisma:generate

# Открываем порт 4000 для приложения
EXPOSE 4000

# Устанавливаем переменные окружения
ENV PORT=4000
ENV NODE_ENV=production

# Создаем скрипт для запуска миграций и приложения
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Запускаем скрипт
ENTRYPOINT ["docker-entrypoint.sh"]