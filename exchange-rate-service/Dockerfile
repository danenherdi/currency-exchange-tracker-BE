FROM denoland/deno:2.0.3
WORKDIR /app
COPY . .
RUN deno cache deps.ts
EXPOSE 3334
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "rate-service.ts"]
