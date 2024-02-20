FROM python:3.10

RUN pip install poetry


WORKDIR /app

COPY requirements.txt ./
COPY pyproject.toml poetry.lock* /app/
# Установка зависимостей проекта
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi


COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]