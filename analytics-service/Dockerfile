# analytics-service/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instalar TODAS las dependencias (sin --omit=dev)
RUN npm ci

COPY . .

# ==============================================================
# STAGE 2: RUNTIME
# ==============================================================
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copiar solo lo necesario del builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

# Usuario no-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 8080

CMD ["npm", "start"]