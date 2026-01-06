# Fastapi
FROM python:3.14-alpine AS backend-dev
WORKDIR /usr/local/app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/alembic.ini ./
COPY backend/alembic ./alembic
COPY backend/app ./app
COPY backend/test ./test
COPY backend/.env ./.env
COPY backend/static/images ./static/images

EXPOSE 8000

RUN addgroup -S appgroup && adduser -S -D -H -u 1000 -G appgroup appuser
RUN chown -R appuser ./static/images
USER appuser


# react
FROM node:24-alpine AS frontend-dev
WORKDIR /app

COPY frontend/. .
COPY frontend/.env ./.env
RUN npm install

EXPOSE 5173

USER node

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]