# 🚗 QuickWheels Client - Setup Guide

## 📦 Installation

```bash
npm install
```

---

## ⚙️ Environment Configuration

QuickWheels uses environment variables to switch between **local** and **cloud** deployment easily.

### 🏠 Local Development Setup

1. **Create local environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Your `.env` should contain:**

   ```env
   VITE_AUTH_API_BASE_URL=http://localhost:5000
   VITE_VEHICLE_API_BASE_URL=http://localhost:5001
   VITE_BOOKING_API_BASE_URL=http://localhost:5002
   VITE_ENV=development
   ```

3. **Start backend services** (in separate terminals):

   ```bash
   # Auth Service
   cd ../quickwheels-server/auth-service
   dotnet run

   # Vehicle Service
   cd ../quickwheels-server/vehicle-service
   dotnet run

   # Booking Service
   cd ../quickwheels-server/booking-service
   dotnet run
   ```

4. **Start frontend:**

   ```bash
   npm run dev
   ```

   ✅ App will run at: `http://localhost:5173`

### ☁️ Production/Cloud Setup

1. **Create production environment file:**

   ```bash
   cp .env.example .env.production
   ```

2. **Edit `.env.production` for your deployment:**

   **Option A: Using Nginx Reverse Proxy (Recommended)**

   ```env
   VITE_AUTH_API_BASE_URL=/api/auth
   VITE_VEHICLE_API_BASE_URL=/api/vehicle
   VITE_BOOKING_API_BASE_URL=/api/booking
   VITE_ENV=production
   ```

   **Option B: Direct Service URLs**

   ```env
   VITE_AUTH_API_BASE_URL=https://your-domain.com:5000
   VITE_VEHICLE_API_BASE_URL=https://your-domain.com:5001
   VITE_BOOKING_API_BASE_URL=https://your-domain.com:5002
   VITE_ENV=production
   ```

3. **Build for production:**

   ```bash
   npm run build
   ```

   Build files will be in `dist/` folder.

---

## 🔍 Check Your Configuration

Run this command to verify your environment setup:

```bash
npm run check-env
```

**Expected Output:**

```
============================================================
🔧 QuickWheels Environment Configuration Check
============================================================

📋 Checking .env (Local Development):
  ✅ File exists
  Auth:     http://localhost:5000
  Vehicle:  http://localhost:5001
  Booking:  http://localhost:5002
  Env:      development
  ✅ Configured for local development

📋 Checking .env.production (Cloud/Production):
  ✅ File exists
  Auth:     /api/auth
  Vehicle:  /api/vehicle
  Booking:  /api/booking
  Env:      production
  ✅ Configured for production

💡 Recommendations:
  ✅ Configuration looks good!
```

---

## 🚀 Available Scripts

| Command               | Description                                   |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Start development server                      |
| `npm run build`       | Build for production (uses `.env.production`) |
| `npm run build:local` | Build with local config (uses `.env`)         |
| `npm run preview`     | Preview production build locally              |
| `npm run lint`        | Run ESLint                                    |
| `npm run check-env`   | Verify environment configuration              |

---

## 🔄 Quick Switch: Local ↔️ Cloud

### Switching is automatic based on the command:

```bash
# Development (uses .env)
npm run dev

# Production (uses .env.production)
npm run build
```

### To test production build locally:

```bash
npm run build
npm run preview
```

**See detailed switching guide:** [QUICK_SWITCH.md](QUICK_SWITCH.md)

---

## 📖 Documentation

| File                                                   | Purpose                                    |
| ------------------------------------------------------ | ------------------------------------------ |
| [ENV_CONFIGURATION.md](ENV_CONFIGURATION.md)           | Complete environment setup guide           |
| [QUICK_SWITCH.md](QUICK_SWITCH.md)                     | Quick reference for switching environments |
| [HTTPS_SETUP.md](HTTPS_SETUP.md)                       | HTTPS and geolocation setup                |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Technical implementation details           |

---

## 🎯 Quick Start (TL;DR)

```bash
# 1. Setup
cp .env.example .env
npm install

# 2. Start backend services (3 terminals)
cd ../quickwheels-server/auth-service && dotnet run
cd ../quickwheels-server/vehicle-service && dotnet run
cd ../quickwheels-server/booking-service && dotnet run

# 3. Start frontend
npm run dev

# ✅ Open http://localhost:5173
```

---

## 🧪 Verify Configuration

After starting the dev server, open browser console. You'll see:

```
🔧 API Configuration:
  Auth Service: http://localhost:5000
  Vehicle Service: http://localhost:5001
  Booking Service: http://localhost:5002
  Environment: development
```

This confirms your configuration is loaded correctly!

---

## 🐛 Troubleshooting

### Issue: "Network error - Unable to reach server"

**Solution:**

1. Verify `.env` file exists and has correct URLs
2. Ensure backend services are running
3. Restart dev server: Stop (Ctrl+C) then `npm run dev`

### Issue: "Changes to .env not working"

**Solution:** Restart the dev server (Ctrl+C then `npm run dev`)

### Issue: "Variables showing as undefined"

**Solution:** All variables must start with `VITE_` prefix

### More help?

Run: `npm run check-env` to diagnose configuration issues

---

## 📁 Project Structure

```
quickwheels-client/
├── .env                      ← Local development (git ignored)
├── .env.production          ← Production config (git ignored)
├── .env.example             ← Template file (committed to git)
├── check-env.js             ← Configuration checker script
├── nginx.conf               ← Basic nginx config
├── nginx.production.conf    ← Production nginx with reverse proxy
├── src/
│   ├── api/
│   │   └── http.ts          ← API clients (uses env vars)
│   ├── components/
│   ├── pages/
│   └── ...
└── ...
```

---

## 🌟 Features

- ✅ Cookie-based authentication (HttpOnly)
- ✅ HTTPS-aware geolocation with fallbacks
- ✅ Environment-based configuration
- ✅ Easy local ↔️ cloud switching
- ✅ Nginx reverse proxy support
- ✅ Responsive design
- ✅ Real-time API configuration display

---

## 🔐 Security Notes

1. **.env files are git-ignored** - Keep them safe!
2. **Never commit** `.env` or `.env.production` with real credentials
3. **HTTPS is required** for production (geolocation, cookies)
4. **CORS must be configured** in backend for cross-origin requests

---

## 🆘 Need Help?

1. **Configuration issues?** Run `npm run check-env`
2. **Environment setup?** Read [ENV_CONFIGURATION.md](ENV_CONFIGURATION.md)
3. **Quick switching?** See [QUICK_SWITCH.md](QUICK_SWITCH.md)
4. **HTTPS setup?** Check [HTTPS_SETUP.md](HTTPS_SETUP.md)

---

## 📞 Support

For issues or questions about environment configuration:

1. Run `npm run check-env` to diagnose
2. Check the documentation files listed above
3. Verify backend services are running
4. Check browser console for API configuration logs

---

**Made with ❤️ for QuickWheels** 🚗💨

Now switching between local and cloud is as easy as having the right `.env` file!
