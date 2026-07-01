# Aalind Kale — Software Engineering Portfolio

Welcome to my personal portfolio repository! This is a modern, high-performance, and lightweight portfolio website showcasing my work in systems programming, distributed systems, machine learning, and full-stack web development.

🌐 **Live Website**: [aalind.org](https://aalind.org) or [aalind-portfolio.vercel.app](https://aalind-portfolio.vercel.app)

---

## 🚀 About Me

I am a Computer Science student at **California State University, Long Beach** (Dean's List) specializing in:
- **Systems & Backend**: C++, C, POSIX IPC (semaphores, shared memory), thread-safety (mutexes/locks).
- **Distributed Systems**: Layered network protocols (REST, TCP/UDP, P2P), Lamport logical clocks.
- **Machine Learning**: Convolutional Neural Networks (CNNs), TensorFlow, Keras, ML pipelines.
- **Full-Stack Development**: Clean, vanilla HTML/CSS/JavaScript, React, Node.js, and WebGL.

---

## 📂 Project Highlights

This portfolio showcases four major engineering projects, each equipped with its own **standalone interactive frontend demo** that visualizes complex backend logic right in the browser:

### 1. 📦 Storage Engine (`kvstore-ycsb-perf`)
*A C++17 crash-safe key-value store with append-only log (AOF) durability, on-disk indexing, log compaction, and thread-safety.*
* **Interactive Demo**: Features a terminal-style CLI simulator, real-time index/WAL log updates, interactive log compaction, crash recovery replay, and canvas-rendered YCSB workload throughput charts.
* **Tech Stack**: C++17, GoogleTest, YCSB Benchmarks, Vanilla JS/CSS (Demo).
* **Live Demo**: [Storage Engine Demo](https://zura16.github.io/kvstore-ycsb-perf/)

### 2. ⚔️ RPG Engine (`rpg-engine-semaphores`)
*A modular multi-process RPG adventure visualizer running on Linux utilizing POSIX IPC (shared memory, semaphores, and signals).*
* **Interactive Demo**: Animates three character classes (Barbarian, Wizard, Rogue) as they battle enemies, decode Caesar ciphers, pick combination locks via binary search, and coordinate semaphore levers to secure dungeon treasure.
* **Tech Stack**: C, POSIX Threads/IPC, HTML5 Canvas, JS Animation.
* **Live Demo**: [RPG Engine Demo](https://zura16.github.io/rpg-engine-semaphores/)

### 3. 🚗 Rideshare Comm Systems (`rideshare-comm-systems`)
*A distributed ride-sharing system protocol visualizer simulating multi-layered communication and event ordering.*
* **Interactive Demo**: Visualizes ride requests, server matching algorithms, and driver broadcasts across three distinct layers (REST API, TCP socket streams, and direct P2P mesh discovery) using Lamport logical clocks for logical event sequencing.
* **Tech Stack**: Python, Sockets, SVG Animations, Lamport Clocks.
* **Live Demo**: [Rideshare Demo](https://zura16.github.io/rideshare-comm-systems/)

### 4. 📸 Image Classifier (`456-Final`)
*A deep Convolutional Neural Network trained to classify 10 animal species with 9.5 million parameters.*
* **Interactive Demo**: Includes drag-and-drop user uploads, a sample animal gallery, step-by-step neural layer flow animations (Conv2D -> MaxPool -> Flatten -> Dense -> Softmax), training metric curves, and an interactive confusion matrix heatmap.
* **Tech Stack**: Python, TensorFlow/Keras, Canvas API, Chart.js/Canvas.
* **Live Demo**: [Image Classifier Demo](https://zura16.github.io/456-Final/)

---

## 🎨 Design & Aesthetic Features

- **Liquid Ether WebGL Background**: A customized WebGL shader background that reacts smoothly to mouse movements and hover coordinates.
- **Glassmorphism Panels**: Modern UI layout with glowing card borders, edge-lighting, and high-contrast dark theme aesthetics.
- **Typing Bio Effect**: Dynamic typewriter animation for the sidebar bio.
- **Performance Optimized**: Zero external framework overhead (vanilla HTML/CSS/JS), minimized assets, and responsive, centered elements for optimal mobile rendering.

---

## 🛠️ Running Locally

To run this portfolio website locally on your computer:

1. Clone the repository:
   ```bash
   git clone https://github.com/Zura16/Aalind-Portfolio.git
   cd Aalind-Portfolio
   ```

2. Start a local server:
   Using Python:
   ```bash
   python3 -m http.server 8000
   ```
   Or using Node/npm:
   ```bash
   npx serve .
   ```

3. Open your browser and navigate to `http://localhost:8000` (or the port specified by your server).

---

## 📧 Contact & Connect

- **LinkedIn**: [Aalind Kale](https://www.linkedin.com/in/aalind-kale-6352b6271/)
- **Email**: [kaleaalind7@gmail.com](mailto:kaleaalind7@gmail.com)
- **GitHub**: [@Zura16](https://github.com/Zura16)
