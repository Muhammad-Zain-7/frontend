# ── Stage 1: deps & build ────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: serve with nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Copy the built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config that rewrites all routes to index.html (SPA support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
