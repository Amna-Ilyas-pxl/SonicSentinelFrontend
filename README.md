# SONIC SENTINEL
## Acoustic Threat Detection System — React Native CLI Frontend

> Final Year Project UI Prototype | Pure React Native CLI | TypeScript | Android

---

## PROJECT STRUCTURE

```
SonicSentinel/
├── android/                          # Native Android project
│   ├── app/
│   │   ├── build.gradle              # App-level Gradle config
│   │   ├── proguard-rules.pro
│   │   └── src/main/
│   │       ├── AndroidManifest.xml   # Permissions + API key injection
│   │       ├── java/com/sonicsentinel/
│   │       │   ├── MainActivity.kt
│   │       │   └── MainApplication.kt
│   │       └── res/
│   │           ├── drawable/
│   │           ├── values/           # strings, styles, colors
│   │           └── mipmap-*/         # launcher icons
│   ├── build.gradle                  # Project-level Gradle config
│   ├── gradle.properties             # SDK versions + Maps API key
│   ├── settings.gradle
│   └── gradle/wrapper/
│       └── gradle-wrapper.properties
├── src/
│   ├── components/
│   │   ├── ActionButton.tsx          # Premium CTA button
│   │   ├── AlertCard.tsx             # FlatList incident entry card
│   │   ├── StatusCard.tsx            # Metric status display card
│   │   ├── StyledInput.tsx           # Native text input with icon
│   │   └── ThreatBadge.tsx           # Color-coded threat pill
│   ├── constants/
│   │   ├── mockData.ts               # All dummy data (alerts, markers)
│   │   └── theme.ts                  # Colors, typography, spacing, shadows
│   ├── navigation/
│   │   ├── MainTabNavigator.tsx      # Bottom tab (Home/Alerts/Map)
│   │   ├── RootNavigator.tsx         # Stack: Auth → Main
│   │   └── types.ts                  # Navigation type definitions
│   └── screens/
│       ├── AuthScreen.tsx            # Login interface
│       ├── HomeScreen.tsx            # Dashboard with live metrics
│       ├── AlertsScreen.tsx          # Incident log with filtering
│       └── MapScreen.tsx             # Spatial map with markers
├── App.tsx                           # Root component
├── index.js                          # Entry point
├── app.json
├── babel.config.js
├── metro.config.js
├── package.json
├── react-native.config.js
└── tsconfig.json
```

---

## ENVIRONMENT SETUP (Do This First)

### Step 1 — Install Required Tools

#### A. Node.js (v18 or higher)
- Download: https://nodejs.org
- Verify: `node --version`

#### B. Java Development Kit (JDK 17)
- Download Adoptium Temurin JDK 17: https://adoptium.net/
- Verify: `java -version`

#### C. Android Studio
- Download: https://developer.android.com/studio
- During installation, ensure these are checked:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device (AVD)

#### D. Android SDK Configuration
1. Open Android Studio → SDK Manager (via `Settings > Languages & Frameworks > Android SDK`)
2. Under **SDK Platforms**, install: **Android 14 (API 34)**
3. Under **SDK Tools**, install:
   - Android SDK Build-Tools 34
   - Android Emulator
   - Android SDK Platform-Tools
   - Google Play Services

#### E. Environment Variables
Add these to your shell profile (`~/.bashrc`, `~/.zshrc`, or Windows System Variables):

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk        # macOS
# export ANDROID_HOME=$HOME/Android/Sdk              # Linux

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

**Windows (PowerShell / System Variables):**
```
ANDROID_HOME = C:\Users\<YourName>\AppData\Local\Android\Sdk
PATH += %ANDROID_HOME%\emulator
PATH += %ANDROID_HOME%\platform-tools
PATH += %ANDROID_HOME%\tools
```

Reload your terminal after saving.

#### F. VS Code (optional but recommended)
- Download: https://code.visualstudio.com
- Install extensions:
  - **React Native Tools** (Microsoft)
  - **ESLint** (Microsoft)
  - **Prettier** (Prettier)
  - **TypeScript and JavaScript** (Microsoft)

---

## PROJECT SETUP

### Step 1 — Install Dependencies
```bash
cd SonicSentinel
npm install
```

### Step 2 — Link Vector Icons (Android)
Add the following line to `android/app/build.gradle` inside the `apply plugin:` block section at the top:

```gradle
project.ext.vectoricons = [
    iconFontNames: ['Ionicons.ttf', 'MaterialIcons.ttf', 'FontAwesome.ttf']
]
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

This copies the font files to Android assets automatically on build.

### Step 3 — Google Maps API Key

The app uses `react-native-maps` with Google Maps. You need a Maps API key:

1. Go to: https://console.cloud.google.com
2. Create a new project (or use existing)
3. Enable **Maps SDK for Android**
4. Create an API key under **Credentials**
5. Open `android/gradle.properties`
6. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual key:
   ```
   MAPS_API_KEY=AIzaSy...YourRealKey
   ```

> **Note for Demo/Testing**: If you skip the API key, the map screen will show a blank grey background but all other screens will work perfectly.

### Step 4 — Create Android Emulator

1. Open **Android Studio**
2. Go to **Device Manager** (toolbar icon or `View > Tool Windows > Device Manager`)
3. Click **Create Device**
4. Select: **Pixel 7** → Next
5. Select system image: **API 34 (Android 14)** (download if needed)
6. Finish → Your emulator appears in the list
7. Press the ▶️ play button to start it

---

## RUNNING THE APP

### Terminal 1 — Start Metro Bundler
```bash
npx react-native start
```

### Terminal 2 — Build & Deploy to Android
```bash
npx react-native run-android
```

The app will build via Gradle and launch on your emulator or connected device automatically.

---

## RUNNING ON PHYSICAL DEVICE

1. Enable **Developer Options** on your Android device:
   - Go to `Settings > About Phone`
   - Tap **Build Number** 7 times
2. Enable **USB Debugging** in Developer Options
3. Connect device via USB
4. Verify with: `adb devices` (your device should appear)
5. Run: `npx react-native run-android`

---

## COMMON ISSUES & FIXES

### ❌ Gradle Build Fails — SDK not found
```
Error: SDK location not found
```
**Fix**: Create `android/local.properties` with:
```
sdk.dir=/Users/<YourName>/Library/Android/sdk
# Windows: sdk.dir=C:\\Users\\<YourName>\\AppData\\Local\\Android\\Sdk
```

### ❌ Metro Bundler Port Already in Use
```bash
npx react-native start --port 8082
npx react-native run-android --port 8082
```

### ❌ INSTALL_FAILED_INSUFFICIENT_STORAGE
- Open Android Studio → Device Manager → Wipe Data on emulator

### ❌ react-native-maps blank on emulator
- Make sure Google Play Services is available on your emulator image
- Use an emulator image labeled **"Google APIs"** or **"Google Play"**

### ❌ Vector Icons showing squares/boxes
- Rebuild after running: `npx react-native run-android --reset-cache`
- Confirm the `fonts.gradle` apply line was added to `android/app/build.gradle`

### ❌ TypeScript errors in IDE
```bash
npx tsc --noEmit
```
Install types if needed:
```bash
npm install --save-dev @types/react @types/react-native-vector-icons
```

---

## TECH STACK SUMMARY

| Layer | Technology |
|---|---|
| Framework | React Native 0.73 (CLI) |
| Language | TypeScript 5.0 |
| Navigation | React Navigation 6 (Stack + Tabs) |
| Map Engine | react-native-maps (Google Maps) |
| Icons | react-native-vector-icons (Ionicons) |
| Styling | React Native StyleSheet (no CSS engines) |
| Build System | Gradle 8.3 + Android SDK 34 |
| JS Engine | Hermes |
| Architecture | Old Arch (New Arch disabled for compatibility) |

---

## SCREENS OVERVIEW

| Screen | Route | Description |
|---|---|---|
| Auth | `Auth` | Login interface with animated submit |
| Home | `Main/Home` | System dashboard + live noise metric |
| Alerts | `Main/Alerts` | Filterable incident log (FlatList) |
| Map | `Main/Map` | Full-screen dark map with node markers |

---

*SONIC SENTINEL — Academic Frontend Prototype. No backend connections.*
