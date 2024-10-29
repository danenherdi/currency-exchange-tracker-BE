#!/bin/bash

set -e  # Hentikan script jika terjadi error

# Deploy Exchange Rate Service
echo "Deploying Exchange Rate Service..."
cd exchange-rate-service
kubectl apply -f exchange-rate-deployment.yaml
kubectl apply -f exchange-rate-service.yaml
cd ..

# Deploy Currency Conversion Service
echo "Deploying Currency Conversion Service..."
cd currency-conversion-service
kubectl apply -f currency-conversion-service/currency-conversion-deployment.yaml
kubectl apply -f currency-conversion-service/currency-conversion-service.yaml
cd ..

echo "Services successfully deployed!"
