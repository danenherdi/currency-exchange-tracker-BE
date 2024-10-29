#!/bin/bash

echo "Checking status of pods and services..."

# Tampilkan status Pods
echo "Pods:"
kubectl get pods -o wide

# Tampilkan status Services
echo "Services:"
kubectl get svc

# Tampilkan logs dari setiap Pod (opsional)
read -p "Do you want to see logs? (y/n): " choice
if [ "$choice" == "y" ]; then
    echo "Showing logs from Exchange Rate Service pod..."
    kubectl logs -l app=exchange-rate-service

    echo "Showing logs from Currency Conversion Service pod..."
    kubectl logs -l app=currency-conversion-service
fi
