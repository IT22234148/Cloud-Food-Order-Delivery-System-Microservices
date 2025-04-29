# 🍔 Cloud-Native Food Ordering & Delivery System  

## 🚀 Project Overview  
This project is a cloud-based food ordering and delivery platform developed using the MERN stack with a Microservices Architecture. It enables customers to explore restaurant menus, place orders, process payments, and monitor delivery statuses in real-time. Restaurant admins can manage menus and orders, while delivery drivers are able to track and fulfill delivery tasks.

It leverages containerization with Docker, orchestrates services via Kubernetes, secures interactions through JWT-based authentication, and delivers instant email/SMS notifications.

---

## 📌 Features & Functionalities  

### **🔹 User Authentication & Role Management**  
- Customers, Restaurant Admins, and Delivery Personnel have distinct roles.  
- Secure authentication using **JWT (JSON Web Tokens)**.  
- Role-based access control (**RBAC**) to restrict functionalities.  

### **🔹 Restaurant Management**  
- Restaurant Admins can **add, update, delete** menu items.  
- Set restaurant **availability & manage orders**.  

### **🔹 Order Management**  
- Customers can **browse menus**, add items to a **cart**, and place orders.  
- Modify orders before confirmation.  
- Track order **status** in real-time.  

### **🔹 Delivery Management**  
- When an order is confirmed, the Delivery Service automatically assigns the nearest available delivery driver.  
- Delivery personnel can view assigned deliveries and update their delivery status (e.g., "assigned" → "in_transit" → "delivered").  
- Customers can track delivery progress in real-time by entering their Order ID in the tracking interface.  
- Real-time location updates are supported through WebSocket communication, allowing customers to view live driver movement.  

### **🔹 Secure Payment Integration**  
- Payment gateways such as **Stripe** are integrated.  
- Secure payment processing & order confirmation upon successful transactions.  

### **🔹 Real-time Notifications**  
- Delivery personnel are notified immediately when a new order is assigned.  
- Customers receive real-time updates about the delivery status through the tracking dashboard.  
- WebSocket integration (Socket.IO) is used for real-time delivery location updates.  

---

## 📌 Tech Stack  

### **🔹 Frontend:**  
- **React.js** (User Interface)  

### **🔹 Backend Microservices:**  
- **Node.js & Express.js** (REST APIs)  
- **MongoDB** (Database)  
- **JWT Authentication** (Security)  

### **🔹 Infrastructure & Deployment:**  
- **Docker** (Containerization)  
- **Kubernetes** (Microservices Orchestration)  
- **Socket.IO** (Real-time communication)  

---

## 📌 Environment Setup  

### **1️⃣ Prerequisites**  
Ensure you have the following installed:  
- **Node.js** (v16+) → [Download Here](https://nodejs.org/)  
- **MongoDB** (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))  
- **Docker & Docker Compose** → [Install Guide](https://docs.docker.com/get-docker/)  
- **Postman** (For API testing)  

---

## 📌 Steps to Deploy the System  

### **1️⃣ Clone the Repository**  
- Clone the project repository to your local machine:
  ```bash
  git clone https://github.com/yourusername/food-delivery-platform.git
  cd food-delivery-platform
  ```

### **2️⃣ Set Up Environment Variables**  
- Configure environment variables for each microservice. Update `.env` files or Kubernetes ConfigMaps/Secrets as needed:
  - MongoDB connection strings
  - JWT secrets
  - Stripe API keys (for payment service)

### **3️⃣ Build Docker Images**  
- Build Docker images for all microservices and the frontend:
  ```bash
  docker-compose build
  ```

### **4️⃣ Run the Application Locally (Optional)**  
- If you want to test the application locally without Docker:
  - Install dependencies:
    ```bash
    npm run install:all
    ```
  - Start services individually:
    ```bash
    npm run start:auth-service
    npm run start:order-service
    npm run start:restaurant-service
    npm run start:delivery-service
    npm run start:payment-service
    npm run start:notification-service
    npm run start:frontend
    ```

### **5️⃣ Deploy with Docker Compose**  
- Start all services using Docker Compose:
  ```bash
  docker-compose up
  ```
- Access the application at [http://localhost:3000](http://localhost:3000).

### **6️⃣ Deploy with Kubernetes**  
- Ensure you have a Kubernetes cluster running (e.g., Minikube, Docker Desktop, or a cloud provider).
- Apply Kubernetes manifests:
  ```bash
  kubectl apply -f k8s/
  ```
- Verify the deployment:
  ```bash
  kubectl get pods -n food-delivery-system
  kubectl get services -n food-delivery-system
  ```
- Access the application via the LoadBalancer or Ingress URL.

### **7️⃣ Monitor Logs**  
- Use the following commands to monitor logs for debugging:
  ```bash
  docker-compose logs -f
  ```
  Or for Kubernetes:
  ```bash
  kubectl logs -f <pod-name> -n food-delivery-system
  ```

### **8️⃣ Test the Application**  
- Use Postman or a similar tool to test API endpoints.
- Access the frontend at the provided URL and test the user flows (e.g., registration, login, placing orders, tracking deliveries).

### **9️⃣ Scale Services (Optional)**  
- Scale services in Kubernetes if needed:
  ```bash
  kubectl scale deployment <service-name> --replicas=<number> -n food-delivery-system
  ```

### **🔟 Stop Services**  
- To stop services in Docker Compose:
  ```bash
  docker-compose down
  ```
- To delete Kubernetes resources:
  ```bash
  kubectl delete -f k8s/
  ```

---

## 📌 Project Structure  

```
├── frontend/                 # React frontend application
├── backend/                  # Backend services
│   ├── auth-service/         # Authentication and user management
│   ├── order-service/        # Order and cart management
│   ├── restaurant-service/   # Food items and restaurant management
│   ├── delivery-service/     # Delivery management and driver tracking
│   ├── payment-service/      # Payment processing
│   └── notifications-service/ # Email/SMS notifications
├── docker-compose.yml        # Docker Compose configuration
└── kubernetes/               # Kubernetes deployment files
```

---

## 📌 Accessing the Application  

- Local development: [http://localhost:3000](http://localhost:3000)  
- Docker: [http://localhost:3000](http://localhost:3000)  

---

## 📌 API Endpoints  

### Auth Service (Port 5000)  
- `/api/auth/register` - Register a new user  
- `/api/auth/login` - Login user  

### Order Service (Port 5005)  
- `/api/cart` - Cart operations  
- `/api/orders` - Order management  

### Restaurant Service (Port 5001)  
- `/api/restaurants` - Restaurant management  

### Delivery Service (Port 5002)  
- `/api/delivery` - Delivery operations  

### Payment Service (Port 5004)  
- `/api/payments` - Payment processing  

### Notifications Service (Port 5003)  
- `/api/notifications` - Email/SMS notifications