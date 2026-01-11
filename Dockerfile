# fastapi base
FROM python:3.14-alpine AS backend-base
WORKDIR /usr/local/app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt; \
    addgroup -S -g 1000 app; \
    adduser -S -D -H -u 1000 -G app app;

COPY --chown=app:app backend/app ./app
COPY --chown=app:app backend/.env ./
COPY --chown=app:app backend/static/images ./static/images

# fastapi backend
FROM backend-base AS backend-dev

COPY --chown=app:app backend/alembic.ini ./
COPY --chown=app:app backend/alembic ./alembic
COPY --chown=app:app backend/migrate_seed.sh ./
COPY --chown=app:app backend/seeds ./seeds
RUN chmod +x ./migrate_seed.sh

EXPOSE 8000

USER app:app
CMD ["/bin/ash", "-c", "./migrate_seed.sh && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]

# fastapi test
FROM backend-base AS backend-test

COPY --chown=app:app backend/pyproject.toml ./
COPY --chown=app:app backend/test ./test

RUN mkdir .pytest_cache; \
    chown -R app:app .pytest_cache;

USER app:app
CMD ["python", "-m", "pytest"]

# react
FROM node:24-alpine AS frontend-dev
WORKDIR /app

USER node
COPY --chown=node:node frontend/. .

USER root
RUN npm install; \
    chown -R node:node node_modules

EXPOSE 5173

USER node
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
