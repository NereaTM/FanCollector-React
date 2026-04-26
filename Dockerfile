# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV VITE_API_URL=http://a0ebb5f3764e84651ad64f527d3bbc83-387964106.us-east-1.elb.amazonaws.com
ENV VITE_EMAILJS_SERVICE_ID=service_h1wmur4
ENV VITE_EMAILJS_PUBLIC_KEY=P9NDGyuWhrzzmzAHj
ENV VITE_EMAILJS_TEMPLATE_ID=FORM_USER
ENV VITE_EMAILJS_NEWSLETTER_TEMPLATE_USER=NEWSLETTER_USER
RUN npm run build

# Stage 2: Runtime
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]