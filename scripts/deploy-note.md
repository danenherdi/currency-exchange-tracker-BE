Berikut adalah **panduan lengkap** untuk **deploy microservices Deno** di **Minikube** yang berjalan di **EC2 instance AWS**.

---

## **Langkah 1: Persiapan EC2 Instance**

1. **Buat EC2 Instance:**
   - Buka AWS Console dan buat instance EC2 (misalnya, Ubuntu 20.04).
   - Pastikan untuk memilih **security group** yang membuka port:
     - **22** (SSH)
     - **30000-32767** (untuk akses NodePort Minikube)

2. **SSH ke EC2 Instance:**
   Setelah instance aktif, SSH ke dalamnya:
   ```bash
   ssh -i /path/to/your-key.pem ubuntu@<EC2_PUBLIC_IP>
   ```

3. **Instal Docker dan Minikube:**
   Di dalam instance EC2, instal Docker dan Minikube:

   ```bash
   # Instal Docker
   sudo apt update
   sudo apt install -y docker.io
   sudo usermod -aG docker $USER

   # Instal Minikube
   curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
   sudo install minikube-linux-amd64 /usr/local/bin/minikube

   # Mulai Minikube
   minikube start --driver=docker
   ```

4. **Verifikasi Minikube:**
   Pastikan Minikube berjalan dengan benar:
   ```bash
   minikube status
   ```

---

## **Langkah 2: Build Docker Images dan Load ke Minikube**

1. **Build Docker Images:**

   Jalankan perintah ini untuk build images dari microservices di direktori proyek Anda.

   ```bash
   cd exchange-rate-service
   docker build -t exchange-rate-service:latest .
   minikube image load exchange-rate-service:latest

   cd ../currency-conversion-service
   docker build -t currency-conversion-service:latest .
   minikube image load currency-conversion-service:latest
   ```

---

## **Langkah 3: Deployment YAML Configuration**

### **Exchange Rate Service Deployment dan Service YAML**

**exchange-rate-deployment.yaml**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: exchange-rate-service
  labels:
    app: exchange-rate-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: exchange-rate-service
  template:
    metadata:
      labels:
        app: exchange-rate-service
    spec:
      containers:
        - name: exchange-rate-service
          image: exchange-rate-service:latest
          ports:
            - containerPort: 3334
          env:
            - name: EXCHANGE_API_KEY
              valueFrom:
                secretKeyRef:
                  name: exchange-rate-secret
                  key: api_key
```

**exchange-rate-service.yaml**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: exchange-rate-service
spec:
  selector:
    app: exchange-rate-service
  ports:
    - protocol: TCP
      port: 3334
      targetPort: 3334
  type: NodePort
```

### **Currency Conversion Service Deployment dan Service YAML**

**currency-conversion-deployment.yaml**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: currency-conversion-service
  labels:
    app: currency-conversion-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: currency-conversion-service
  template:
    metadata:
      labels:
        app: currency-conversion-service
    spec:
      containers:
        - name: currency-conversion-service
          image: currency-conversion-service:latest
          ports:
            - containerPort: 3335
          env:
            - name: EXCHANGE_API_KEY
              valueFrom:
                secretKeyRef:
                  name: exchange-rate-secret
                  key: api_key
```

**currency-conversion-service.yaml**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: currency-conversion-service
spec:
  selector:
    app: currency-conversion-service
  ports:
    - protocol: TCP
      port: 3335
      targetPort: 3335
  type: NodePort
```

---

## **Langkah 4: Deploy Microservices di Minikube**

1. **Deploy Exchange Rate Service:**
   ```bash
   kubectl apply -f exchange-rate-deployment.yaml
   kubectl apply -f exchange-rate-service.yaml
   ```

2. **Deploy Currency Conversion Service:**
   ```bash
   kubectl apply -f currency-conversion-deployment.yaml
   kubectl apply -f currency-conversion-service.yaml
   ```

3. **Verifikasi Deployment:**
   ```bash
   kubectl get pods
   kubectl get svc
   ```

---

## **Langkah 5: Akses Layanan Melalui Minikube**

1. **Temukan URL NodePort:**
   ```bash
   minikube service exchange-rate-service --url
   minikube service currency-conversion-service --url
   ```

2. **Contoh Tes API Exchange Rate Service:**
   ```bash
   curl <EXCHANGE_RATE_SERVICE_URL>/rates
   ```

3. **Contoh Tes API Currency Conversion Service:**
   ```bash
   curl -X POST <CURRENCY_CONVERSION_SERVICE_URL>/convert \
   -H "Content-Type: application/json" \
   -d '{
     "from": "USD",
     "to": "IDR",
     "amount": 100
   }'
   ```

---

## **Langkah 6: Debugging dan Logs**

1. **Lihat Logs dari Pod:**
   ```bash
   kubectl logs -l app=exchange-rate-service
   kubectl logs -l app=currency-conversion-service
   ```

2. **Periksa Status Pods dan Services:**
   ```bash
   kubectl get pods
   kubectl get svc
   ```

---

## **Kesimpulan**

Dengan langkah-langkah di atas, Anda telah berhasil:
1. **Menyiapkan EC2 instance** dengan Docker dan Minikube.
2. **Membuat dan memuat Docker images** ke Minikube.
3. **Mendeploy kedua microservices** dengan YAML di Minikube.
4. **Mengakses dan menguji layanan** menggunakan NodePort Minikube.

Arsitektur ini memungkinkan kedua layanan berjalan sebagai **microservice independen** yang dapat diskalakan dan dikelola secara terpisah di Kubernetes.