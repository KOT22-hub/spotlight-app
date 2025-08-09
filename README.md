# 📸 Spotlight

**Spotlight** is a mock Instagram-style mobile app built with **React Native** using the **Expo** framework. It features image posting, a real-time feed, and user authentication via **Clerk**. The backend is powered by **Convex**, offering real-time data and function execution in the cloud.

> ⚠️ This project is a prototype/demo and not intended for production use.

---

## 🛠️ Tech Stack

### Frontend
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Clerk Expo](https://clerk.com/docs/expo/overview) – for user authentication

### Backend
- [Convex](https://convex.dev/) – Backend-as-a-service with real-time database and functions

> 🔍 **Reflection**: Convex offers real-time capabilities and seamless React integration, but its abstraction and architectural learning curve made backend development slower than expected. A more familiar stack like **Node.js + MongoDB** might have been a smoother path.

---

## 🔐 Authentication

User sign-up, sign-in, and session management are handled by **Clerk**, integrated into the Expo app using their React Native SDK.

Features:
- OAuth support (Google, Apple, etc.)
- Secure session handling
- Clerk-managed user database

---
🧠 Challenges & Notes
Clerk + Expo integration required manual configuration for redirect URLs and deep linking.
Convex’s function structure is declarative and unique, adding friction for CRUD-heavy tasks.


🧭  Possible improvements
Implement notifications
 Use cloud image storage (Cloudinary or S3)
 UI enhancements with animations
 Optional migration to Node.js + MongoDB backend

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/spotlight.git
cd spotlight

