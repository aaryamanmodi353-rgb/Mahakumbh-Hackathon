# 🕉️ Kumbh Yatra AI - Command Center 2026

![Mahakumbh AI Banner](https://img.shields.io/badge/Mahakumbh-2026-FF9933?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Deployment](https://img.shields.io/badge/Render-Ready-46E3B7?style=for-the-badge&logo=render)

**Kumbh Yatra AI** is a production-ready, highly interactive Command Center designed to manage the world's largest human gathering—the 2026 Mahakumbh Mela. 

This platform aggregates simulated real-time data, predictive AI insights, and geospatial mapping to empower government authorities and law enforcement to preemptively manage crowd surges, parking capacity, and river safety.

---

## ✨ Key Features

### 🌍 **Interactive Surveillance Mapping & Reverse Geocoding**
- Live multi-city navigation focusing on Prayagraj (2026 Host), Haridwar, Ujjain, and Nashik.
- Drop a custom **Surveillance Pin** anywhere on the map to automatically generate localized crowd metrics.
- Integrates the **Nominatim OpenStreetMap API** to instantly reverse-geocode custom pins to real-world addresses.

### 📊 **Real-Time Data Simulation Engine**
- A robust React Context-based simulation engine fluctuates data every 3 seconds.
- Monitors **Total Footfall**, **Active Vehicles**, **Parking Capacity**, and **Critical Alerts** dynamically based on complex algorithms and coordinate hashing.

### 🗣️ **Global Localization (EN / HI / ES / FR)**
- Designed for an international audience and local Indian authorities.
- The platform features a **Deep Translation Engine** that instantly translates the UI *and* the dynamic backend database strings into **Hindi**, **Spanish**, and **French**.

### 🌊 **River Safety Monitor**
- Real-time tracking of Sangam bathing conditions.
- Dynamically measures **Water Level (m)** and **Current Speed (m/s)** to automatically trigger "Safe for Bathing" or "Dangerous Currents" visual alerts.

### 🎙️ **Voice-Activated AI Assistant**
- An integrated Chatbot built using the browser's native **Web Speech API**.
- Allows officials to click a microphone, speak their queries (in their native language), and receive immediate AI assistance without typing.

### 📈 **Predictive Analytics & UI**
- Beautiful, fully responsive **Glassmorphic Dark Mode** design.
- Uses `recharts` for **Crowd Flow Heatmaps** and historical footfall trends to preemptively deploy volunteer teams before stampedes occur.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend**: React 19, HTML5, CSS Modules (Vanilla CSS)
- **Mapping**: [Leaflet](https://leafletjs.com/) & `react-leaflet`
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **External APIs**: Nominatim Reverse Geocoding, Web Speech API

---

## 🚀 Getting Started (Local Development)

To run this project locally on your machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/aaryamanmodi353-rgb/Mahakumbh-Hackathon.git
   cd Mahakumbh-Hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **View the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment (Render)

This project is fully configured for a "1-Click" deployment via **Render Blueprint**.

1. Create an account on [Render.com](https://render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect this GitHub repository.
4. Render will automatically read the `render.yaml` file, provision a Node.js 20 environment, build the application, and deploy it securely.

---

## 💡 Hackathon Note
This project was designed entirely to solve the massive logistical, linguistic, and safety hurdles of hosting 100+ million pilgrims. By combining cutting-edge frontend architecture with highly authentic, locally-aware features (like Hindi translations and River Safety monitors), Kumbh Yatra AI represents the future of smart-city festival management.
