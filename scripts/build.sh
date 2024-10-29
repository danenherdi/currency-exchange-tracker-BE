#!/bin/bash

set -e  # Hentikan script jika terjadi error

# Build Exchange Rate Service
echo "Building Exchange Rate Service Docker image..."
cd exchange-rate-service
docker build -t exchange-rate-service:latest .
minikube image load exchange-rate-service:latest
cd ..

# Build Currency Conversion Service
echo "Building Currency Conversion Service Docker image..."
cd currency-conversion-service
docker build -t currency-conversion-service:latest .
minikube image load currency-conversion-service:latest
cd ..

echo "Docker images successfully built and loaded into Minikube!"
