# Deployment Steps for Notes App

## Current Status
- ✅ Frontend deployed to Vercel: `notes-hub-mu.vercel.app`
- ❌ Backend needs to be deployed
- ❌ Environment variables need to be set

## Step 1: Deploy Backend

### Option A: Deploy to Render (Recommended - Free)

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `notes-backend` (or any name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: (leave empty or `npm install`)
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGODB_URI` = Your MongoDB connection string
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://notes-hub-mu.vercel.app`
6. Click "Create Web Service"
7. Wait for deployment (takes 2-3 minutes)
8. Copy your backend URL (e.g., `https://notes-backend.onrender.com`)

### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add service → Select "backend" folder
5. Add Environment Variables:
   - `MONGODB_URI` = Your MongoDB connection string
   - `FRONTEND_URL` = `https://notes-hub-mu.vercel.app`
6. Deploy automatically starts
7. Copy your backend URL

### Option C: Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create notes-backend`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set FRONTEND_URL=https://notes-hub-mu.vercel.app
   ```
5. Deploy: `git push heroku main`

## Step 2: Update Vercel Environment Variables

1. Go to [vercel.com](https://vercel.com)
2. Select your project (`notes-hub`)
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://notes-backend.onrender.com`)
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**

## Step 3: Redeploy Frontend

1. In Vercel dashboard, go to **Deployments**
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic redeploy

## Step 4: Update MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to **Network Access**
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (or add your backend server's IP)
5. Click **Confirm**

## Step 5: Test

1. Visit your Vercel app: `https://notes-hub-mu.vercel.app`
2. Try adding a note
3. Check browser console (F12) for any errors
4. Verify notes appear and can be deleted

## Troubleshooting

### Frontend still shows localhost error:
- Check Vercel environment variables are set correctly
- Make sure you redeployed after adding the variable
- Check browser console for the actual API URL being used

### CORS errors:
- Make sure backend CORS includes your Vercel URL
- Check backend logs for CORS errors
- Verify `FRONTEND_URL` is set in backend environment

### Backend not responding:
- Check backend deployment logs
- Verify MongoDB connection string is correct
- Check if backend URL is accessible (try opening in browser)

## Quick Commands

### Check backend health:
```bash
curl https://your-backend-url.com/
```

### Test API endpoint:
```bash
curl https://your-backend-url.com/notes
```
