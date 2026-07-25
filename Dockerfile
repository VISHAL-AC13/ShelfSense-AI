# Multi-stage Dockerfile for ColdSense AI (Python Flask + React Full-Stack App)

# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/cold_chain_web
COPY cold_chain_web/package*.json ./
RUN npm install
COPY cold_chain_web/ ./
RUN npm run build

# Stage 2: Python Flask Backend & Static Server
FROM python:3.11-slim
WORKDIR /app/backend

# Install backend dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy Python backend code
COPY backend/ ./

# Copy built React static bundle from Stage 1 into cold_chain_web/dist
WORKDIR /app
COPY --from=frontend-builder /app/cold_chain_web/dist ./cold_chain_web/dist

# Expose port (default 5000 or dynamically bound by cloud platform)
EXPOSE 5000
ENV PORT=5000

# Set working directory to backend and run production WSGI server
WORKDIR /app/backend
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "app:app"]
