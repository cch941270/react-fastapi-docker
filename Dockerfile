# fastapi base
FROM python:3.14-alpine AS backend-base
WORKDIR /usr/local/app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY backend/.env ./.env
COPY backend/static/images ./static/images

RUN addgroup -S appgroup && adduser -S -D -H -u 1000 -G appgroup appuser
RUN chown -R appuser:appgroup ./static/images

# fastapi backend
FROM backend-base AS backend-dev

COPY backend/alembic.ini ./
COPY backend/alembic ./alembic

EXPOSE 8000

USER appuser

# fastapi test
FROM backend-base AS backend-test

COPY backend/test ./test
COPY backend/pyproject.toml ./

RUN mkdir .pytest_cache
RUN chown -R appuser:appgroup .pytest_cache

USER appuser
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