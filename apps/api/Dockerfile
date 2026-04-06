FROM node:25-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copy packages
COPY packages/ ./packages/

# Copy prisma schema
COPY prisma/ ./prisma/

# Copy api source
COPY apps/api/ ./apps/api/

# Install all dependencies (will install prisma v6 from root package.json)
RUN pnpm install

# Generate Prisma client
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Build the API
RUN pnpm --filter api run build

WORKDIR /app/apps/api

EXPOSE 3000

# At runtime: push schema to DB then start
CMD ["sh", "-c", "npx prisma db push --schema=/app/prisma/schema.prisma && node dist/main"]
