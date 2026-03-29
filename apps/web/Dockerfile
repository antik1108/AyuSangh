FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copy packages (shared-types needed)
COPY packages/ ./packages/

# Copy web source
COPY apps/web/ ./apps/web/

# Install dependencies
RUN pnpm install

# Build Next.js
RUN pnpm --filter web run build

# Copy static assets into standalone output
RUN cp -r apps/web/public apps/web/.next/standalone/apps/web/public
RUN cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/web/.next/standalone/apps/web/server.js"]
