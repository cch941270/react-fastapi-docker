# fastapi base
FROM python:3.14-alpine AS backend-base
WORKDIR /usr/local/app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

RUN addgroup -S -g 1000 app; \
    adduser -S -D -H -u 1000 -G app app;
USER app:app

COPY --chown=app:app backend/app ./app
COPY --chown=app:app backend/.env ./.env
COPY --chown=app:app backend/static/images ./static/images

# fastapi backend
FROM backend-base AS backend-dev

COPY --chown=app:app backend/alembic.ini ./
COPY --chown=app:app backend/alembic ./alembic

EXPOSE 8000

# fastapi test
FROM backend-base AS backend-test

COPY --chown=app:app backend/test ./test
COPY --chown=app:app backend/pyproject.toml ./

USER root
RUN mkdir .pytest_cache; \
    chown -R app:app .pytest_cache;

USER app:app
CMD ["python", "-m", "pytest"]

# react
FROM node:24-alpine AS frontend-dev
WORKDIR /app

COPY frontend/. .
COPY frontend/.env ./.env
RUN npm install
RUN chown -R node:node .

EXPOSE 5173

USER node

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]