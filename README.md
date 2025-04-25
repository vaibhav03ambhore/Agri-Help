# 🌾 AgriHelp - Intelligent Agricultural Decision Support System


AgriHelp is a full-stack agricultural assistant that leverages Machine Learning and the MERN stack to help farmers make informed decisions. It includes features like crop and fertilizer recommendations, plant disease detection, and pest identification, all wrapped in a modern, responsive web interface.

---

## 🔍 Key Features

- 🌱 **Crop Recommendation**: Random Forest-based system using soil and environmental data  
- 💧 **Fertilizer Recommendation**: Nutrient analysis with Random Forest algorithm  
- 🦠 **Plant Disease Detection**: ResNet50 model for image-based diagnosis  
- 🐞 **Pest Identification**: MobileNetV2 for pest recognition from images  
- 👥 **User Management**: JWT authentication with OTP verification  
- ☁️ **Cloud Integration**: Image storage via Cloudinary  
- 🔔 **Notifications**: Email/SMS alerts using Nodemailer & Twilio  

---

## 🛠️ Technology Stack

### Web Application (MERN)
- ⚛️ **Frontend**: React.js + Vite + Tailwind CSS  
- 🚀 **Backend**: Node.js + Express.js + MongoDB Atlas  
- 🔐 **Security**: JWT + Bcrypt + HTTPS  

### Machine Learning
- 🐍 **Frameworks**: Flask + TensorFlow + Scikit-learn  
- 📡 **Model Serving**: 4 independent Flask microservices  
- 📱 **Optimization**: TFLite for mobile deployment  

---

## 🚀 Local Setup

### Prerequisites
- 🟢 Node.js v18+  
- 🐍 Python 3.9+  
- ☁️ MongoDB Atlas account  

### Installation Steps

#### 1. 🧠 ML Model Microservices (Flask)

Each microservice runs independently in its own folder:

- **Crop Recommendation Service**
    ```
    cd Flask_Api/microS3
    pip install -r crop_req.txt
    python crop_service.py
    ```

- **Fertilizer Recommendation Service**
    ```
    cd Flask_Api/microS4
    pip install -r fertilizer_req.txt
    python fertilizer_service.py
    ```

- **Disease Detection Service**
    ```
    cd Flask_Api/microS1
    pip install -r disease_req.txt
    python disease_service.py
    ```

- **Pest Identification Service**
    ```
    cd Flask_Api/microS2
    pip install -r pest_req.txt
    python pest_service.py
    ```

#### 2. 🌐 Backend Setup (Node.js + Express)
```bash
cd AgriHelp_web_app
npm install
npm run backend
```
#### 3. 🖥️ Frontend Setup (React + Vite)
```bash
cd AgriHelp_web_app/Frontend
npm install
npm run dev
```
OR
```bash
cd AgriHelp_web_app/Frontend
npm install
cd ..
npm run frontend
```


---

## 👨‍💻 Development Team
- **Team AgriHelp**
- **Lead Developer**: Vaibhav Datta Ambhore  
- 📧 Email: [vaibhavambhore803@gmail.com](mailto:vaibhavambhore803@gmail.com)  

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  
[![Node.js](https://img.shields.io/badge/Node.js-v18+-brightgreen)](https://nodejs.org/)  
[![Python](https://img.shields.io/badge/Python-3.9+-blue)](https://www.python.org/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)  
[![React](https://img.shields.io/badge/React-v18-blue)](https://reactjs.org/)  
[![TensorFlow](https://img.shields.io/badge/TensorFlow-v2-orange)](https://www.tensorflow.org/)

---

Thank you for checking out AgriHelp! 🌾🚜💡  
Feel free to contribute and help us grow this project to support farmers worldwide.  
Happy Farming! 🌻🌍



