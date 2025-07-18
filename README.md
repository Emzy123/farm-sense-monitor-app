# Farm Sense Monitor App

A modern smart farm monitoring application for real-time sensor data, analytics, and device notifications.

---

## Tech Stack

### Frontend
- **React** (with TypeScript)
- **Vite** (build tool)
- **Tailwind CSS** (utility-first CSS framework)
- **shadcn/ui** (UI components)
- **Recharts** (data visualization)
- **React Query** (data fetching/caching)
- **Supabase Auth** (authentication)
- **Service Workers & Notification API** (device notifications)

### Backend
- **Supabase** (PostgreSQL database, authentication, edge functions)
- **Supabase Edge Functions** (for ML predictions, weather, IoT, etc.)

---

## Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### 1. Clone the Repository
```sh
git clone <YOUR_GIT_REPO_URL>
cd farm-sense-monitor-app
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment
- Supabase is already integrated. If you need to change credentials, edit `src/integrations/supabase/client.ts`.
- For local Supabase development, install the [Supabase CLI](https://supabase.com/docs/guides/cli) and run:
  ```sh
  supabase start
  ```

### 4. Start the Development Server
```sh
npm run dev
```
- The app will be available at `http://localhost:5173` (or as shown in your terminal).

### 5. Build for Production
```sh
npm run build
```
- Output will be in the `dist/` directory.

---

## Key Features
- **User Authentication:** Sign up, login, and profile management via Supabase Auth.
- **Real-Time Sensor Data:** View live temperature, humidity, and soil moisture readings.
- **Advanced Analytics:** Interactive charts and historical data visualization.
- **Device Notifications:** Receive device/browser notifications for critical sensor readings (enable in Settings).
- **Customizable Alerts:** Set thresholds and notification preferences.
- **Mobile-Ready UI:** Responsive design for desktop and mobile.

---

## Project Structure
```
├── src/
│   ├── components/         # Reusable UI and feature components
│   ├── hooks/              # Custom React hooks (auth, data, etc.)
│   ├── integrations/       # Supabase client and types
│   ├── pages/              # Main app pages (Index, History, Settings, etc.)
│   ├── utils/              # Utility functions (data processing, etc.)
│   └── ...
├── public/                 # Static assets and service worker
├── supabase/               # Supabase edge functions and config
├── package.json            # Project metadata and scripts
└── ...
```

---

## Development Tips
- **Device Notifications:**
  - Enable in Settings. Grant browser permission when prompted.
  - Notifications are sent for critical readings (temperature, humidity, soil moisture).
- **Supabase Functions:**
  - Edge functions for ML predictions, weather, and IoT are in `supabase/functions/`.
- **Customizing Thresholds:**
  - Adjust in the Settings page or edit logic in `src/utils/dataProcessing.ts`.

---

## Deployment
- Build the app with `npm run build`.
- Deploy the `dist/` folder to your preferred static hosting (Vercel, Netlify, etc.).
- Ensure your Supabase project is accessible from your deployed domain.

---

## Contributing
1. Fork the repo and create a feature branch.
2. Make your changes and commit with clear messages.
3. Push and open a pull request.

---

## License
MIT

---

## FAQ

### How do I enable device notifications?
- Go to the Settings page in the app.
- Click "Enable Device Notifications" and grant permission in your browser.
- Toggle the switch to receive notifications for critical readings.

### Why am I not receiving notifications?
- Make sure you have granted notification permission in your browser.
- Ensure device notifications are enabled in Settings.
- Some browsers block notifications in incognito/private mode.
- Check your OS/browser notification settings.

### How do I connect to a different Supabase project?
- Edit the credentials in `src/integrations/supabase/client.ts`.
- Make sure your Supabase project has the required tables and functions.

### Can I use this app on mobile?
- Yes! The UI is fully responsive and supports mobile browsers.

### How do I reset my password?
- Use the "Forgot password?" link on the login page (if implemented), or reset via your Supabase Auth dashboard.

---

## Troubleshooting

### App won't start or build
- Ensure you have the correct Node.js and npm versions installed.
- Run `npm install` to ensure all dependencies are present.
- Check for errors in the terminal and resolve any missing packages.

### Supabase errors (auth/data)
- Double-check your Supabase credentials in `src/integrations/supabase/client.ts`.
- Make sure your Supabase project is running and accessible.
- Check the browser console for detailed error messages.

### Notifications not working
- Make sure you have enabled notifications in both the app and your browser.
- Some browsers require HTTPS for notifications.
- Try a different browser or device if issues persist.

### Styling or UI issues
- Ensure Tailwind CSS is properly installed and configured.
- Run `npm run dev` and check for errors in the browser console.

---
