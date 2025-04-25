# 🌐 SHAFO — Сервис сокращения и управления ссылками с аналитикой

**SHAFO** — это удобный и быстрый инструмент для сокращения URL, управления их статусами и получения расширенной статистики с возможностью генерации QR-кодов. Построен на микросервисной архитектуре с использованием **React**, **Django**, и **Gin (Go)**.

---

## ⚙️ Стек технологий

| Компонент          | Стек                                 |
|--------------------|--------------------------------------|
| 🌍 Frontend        | React, React Router, Axios, Tailwind |
| ⚙️ Backend         | Django, Django REST Framework, JWT   |
| 🚀 Микросервис     | Go (Gin), PostgreSQL          |
| 🐳 Контейнеризация | Docker + Docker Compose              |

---

## ✨ Возможности

- 🔗 **Сокращение длинных ссылок**
- 🟢 **Активация/деактивация ссылок**
- 📈 **Просмотр статистики (переходы, последнее использование)**
- 📱 **Автогенерация QR-кодов**
- 🎞️ **Анимация переадресации (на React-странице)**

---

## 🚀 Быстрый запуск (Docker Compose)

### 🛠️ Требования:
- Docker
- Docker Compose

### 🔧 Настройка `.env` (в корне проекта)
```bash
# PostgreSQL
POSTGRES_DB=example_db
POSTGRES_USER=example_user
POSTGRES_PASSWORD=example_password

# Отдельная БД для микросервиса
C_SERVICE_DB=cutter_db

# SMTP (для активации email-функций раскомментировать SMTP-блок в коде Django)
EMAIL_HOST_USER=example@gmail.com
EMAIL_HOST_PASSWORD=123456789
```
### 📦 Запуск

docker-compose up --build

Ожидаемые порты:
- localhost:3000 — клиент (React)
- localhost:8000 — API (Django)
- localhost:8080 — микросервис редиректа (Gin)

---

## 🛠️ Основные команды

### ⚙️ Django

#### Применить миграции
docker exec -it <django_container> python manage.py migrate

#### Создать суперпользователя
docker exec -it <django_container> python manage.py createsuperuser

### 🌍 React

Фронт перезапускается через обычный hot-reload, правки доступны моментально после запуска контейнера.

---

## 📈 Будущие фичи (Roadmap)

- 📍 Метки и категории для ссылок
- 👥 Авторизация через Google / GitHub / Telegram
- 🧠 Расширенная аналитика (геолокации, устройства)

---

