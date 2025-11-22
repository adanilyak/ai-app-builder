## 🚀 How to Run the App

### 0. Prerequisites

Before you start, ensure the following are available:

- **Node.js & npm**
- **iOS Simulator** (requires Xcode on macOS)
- A `.env` file in the project root containing your OpenAI API key:
```
OPENAI_API_KEY=YOUR-OPENAI-KEY
```

---

### 1. Install Dependencies
```bash
npm install
```

---

### 2. Start the Development Server
```bash
npx expo start
```
This will launch the Expo CLI.

---

### 3. Run the App in the iOS Simulator

Inside the Expo CLI:

- Press **i** to run the app in the iOS Simulator.

---

### 4. (Optional) Run the App on a Real iOS Device

1. Install **Expo Go** from the App Store:  
   https://apps.apple.com/app/expo-go/id982107779
2. Start the Expo development server:
```bash
npx expo start
```
3. Scan the QR code shown in the terminal using Camera app.  
   The app will open on your device inside Expo Go app.

## To Do

#### 1. Code
- Create an error view. Error state is done.
- Add paging to chat messages.
