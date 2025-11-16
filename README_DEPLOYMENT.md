# Deployment Guide

## Vercel Deployment

### Frontend Deployment (Vercel)

1. **Push your code to GitHub** (if not already done)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the settings from `vercel.json`

3. **Environment Variables:**
   - In Vercel project settings, add environment variable:
     - `VITE_API_URL` = Your backend API URL (e.g., `https://your-backend.vercel.app` or your backend server URL)

4. **Deploy:**
   - Vercel will automatically build and deploy
   - The build output is configured to `frontend/dist` in `vercel.json`

### Backend Deployment Options

#### Option 1: Deploy Backend to Vercel (Serverless Functions)

1. Create `api/` folder in root
2. Move backend logic to serverless functions
3. Update API routes

#### Option 2: Deploy Backend Separately (Recommended)

**Using Render, Railway, or Heroku:**

1. **Render:**
   - Create new Web Service
   - Connect your GitHub repo
   - Root Directory: `backend`
   - Build Command: (leave empty or `npm install`)
   - Start Command: `node server.js`
   - Add environment variable: `MONGODB_URI`

2. **Railway:**
   - New Project → Deploy from GitHub
   - Select backend folder
   - Add `MONGODB_URI` environment variable
   - Deploy

3. **Heroku:**
   - Create `Procfile` in backend folder: `web: node server.js`
   - Deploy using Heroku CLI or GitHub integration

### Important Notes

- **CORS:** Make sure your backend allows requests from your Vercel frontend URL
- **MongoDB:** Whitelist your backend server's IP address in MongoDB Atlas
- **Environment Variables:** Never commit `.env` files - use platform environment variables

### Local Development

For local development, the frontend will use `http://localhost:5000` by default (no `VITE_API_URL` needed).

### Production Setup

1. Deploy backend first and get the URL
2. Set `VITE_API_URL` in Vercel to your backend URL
3. Redeploy frontend
4. Update backend CORS to allow your Vercel domain
