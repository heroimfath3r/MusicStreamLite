# ------------------------------
# Etapa de construcción
# ------------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# ------------------------------
# Etapa final (runtime)
# ------------------------------
FROM node:18-alpine
WORKDIR /app

# Copiar todo desde el builder (incluye node_modules correctos)
COPY --from=builder /app /app

# Establecer variable de entorno
ENV NODE_ENV=production

# Exponer puerto para Cloud Run
EXPOSE 5234

# Comando de inicio
CMD ["npm", "start"]

