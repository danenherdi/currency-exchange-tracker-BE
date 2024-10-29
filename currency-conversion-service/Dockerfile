FROM denoland/deno:2.0.3
WORKDIR /app
COPY . .
RUN deno cache deps.ts
EXPOSE 3335
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "conversion-service.ts"]
