# frontend/Dockerfile
FROM node:23-alpine@sha256:86703151a18fcd06258e013073508c4afea8e19cd7ed451554221dd00aea83fc

WORKDIR /app

COPY . .

RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
