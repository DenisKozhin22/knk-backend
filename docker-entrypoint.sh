#!/bin/sh

# Выполняем миграции базы данных
echo "Running database migrations..."
yarn prisma:migrate

# Запускаем приложение
echo "Starting application..."
yarn start:prod 