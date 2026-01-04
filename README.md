# WorkSphere 🌐

**A Corporate Social Network with Real-Time AI Content Moderation.**

WorkSphere is a full-stack social platform designed for corporate environments. It fosters communication while maintaining professional standards using a custom fine-tuned AI model that detects hate speech and toxicity in real-time across multiple languages (English, French, Arabic).

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green)
![TensorFlow](https://img.shields.io/badge/TensorFlow-LaBSE-orange)
![Socket.io](https://img.shields.io/badge/Socket.io-RealTime-black)

## 🚀 Features

### 🛡️ AI-Powered Safety (The Core)
- **Multilingual Detection:** Uses a custom fine-tuned **LaBSE (Language-agnostic BERT Sentence Embedding)** model.
- **Real-Time Blocking:** Prevents users from posting toxic content (Posts, Comments, and Replies) instantly.
- **Admin Insights:** A dedicated dashboard for admins to view blocked content attempts, confidence scores, and false positives.

### 👤 User Experience
- **Social Feed:** Create posts with text and images.
- **Interactions:** Like, Comment, and Reply system with nested threading.
- **Profile Management:** Edit details, profile pictures, and change passwords securely.
- **Friend System:** Add/Remove colleagues from your network.
- **Notifications:** Real-time alerts for likes and comments via Socket.io.
- **Dark/Light Mode:** Full theme support.

### 👮 Admin Dashboard
- **User Management:** View all users, change roles (User/Admin), or delete accounts.
- **Report System:** Review content reported by users and take action (Ignore/Delete).
- **AI Logs:** Visualize content that was auto-blocked by the AI, including probability scores and original text.
- **Statistics:** Overview of total users, active reports, and AI intervention stats.

## 🏗️ Architecture

The application follows a Microservices approach:

1.  **Client (Frontend):** React + Styled Components. Handles UI and State.
2.  **Server (Main Backend):** Node.js + Express + MongoDB. Handles Business Logic, Auth (JWT), and Database.
3.  **Hate Speech Service (AI Microservice):** Python + FastAPI + TensorFlow. Loads the fine-tuned Transformer model to analyze text requests from the Node server.

## 🤖 The AI Model

The core of WorkSphere's moderation is a Deep Learning model based on **LaBSE** architecture.

- **Base Model:** `sentence-transformers/LaBSE` (Google).
- **Architecture:** 
  - Frozen LaBSE base layers (Transfer Learning).
  - Unfrozen top 8 layers for fine-tuning.
  - Custom Dense layers with Dropout and L2 Regularization.
  - Trained using Focal Loss to handle class imbalance.
- **Training Data:** Multilingual dataset containing English, Arabic, and French hate speech samples.
- **Performance:** Achieved ~86%+ F1 Scores and High Accuracy on multilingual test sets.

*You can find the full training pipeline and evaluation metrics in the `ai_model/` directory.*

## 🛠️ Installation & Setup

### Prerequisites
- Node.js & npm
- Python 3.8+ & pip
- MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/worksphere.git
cd worksphere
2. Setup Backend (Node.js)
code
cd server
npm install
# Create a .env file based on your config (PORT, MONGO_URL, JWT_SECRET)
npm start
3. Setup Frontend (React)
code
cd ../client
npm install
npm run dev
4. Setup AI Service (Python)
code
cd ../hate_speech_service
# Recommended: Create a virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
⚠️ Important Model Setup:
The trained model weights are not included in this repo due to size.

Run the service:
uvicorn app.main:app --reload --port 8000
📄 License
This project is open source.