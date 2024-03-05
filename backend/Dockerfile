FROM python:3.10

# RUN pip install poetry


WORKDIR /app

COPY requirements.txt ./

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# COPY pyproject.toml poetry.lock* /app/

# # завсимости poetry
# RUN poetry config virtualenvs.create false \
#     && poetry install --no-dev --no-interaction --no-ansi


RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]