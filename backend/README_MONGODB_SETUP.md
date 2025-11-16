# MongoDB Atlas Setup Instructions

## Fixing Authentication Error

The error "bad auth : authentication failed" means your MongoDB credentials are incorrect. Here's how to fix it:

### Option 1: Get Your Connection String from MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Click on your cluster
4. Click **"Connect"** button
5. Choose **"Connect your application"**
6. Copy the connection string (it will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/...`)
7. Replace `<username>` and `<password>` with your actual database user credentials

### Option 2: Create/Reset Database User

1. Go to MongoDB Atlas → **Database Access**
2. Click **"Add New Database User"** or edit existing user
3. Set username and password
4. Make sure user has **"Read and write to any database"** privileges
5. Click **"Add User"** or **"Update User"**

### Option 3: Whitelist Your IP Address

1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. Click **"Add Current IP Address"** or add `0.0.0.0/0` for all IPs (less secure)
4. Click **"Confirm"**

### Setting Up .env File

1. Create a file named `.env` in the `backend` folder
2. Add your connection string:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.sch6n5t.mongodb.net/notesdb?retryWrites=true&w=majority&appName=Cluster0
   ```
3. Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual credentials
4. Make sure there are no spaces around the `=` sign
5. Restart your server

### Example .env file:
```
MONGODB_URI=mongodb+srv://ankitkr1841:YourActualPassword123@cluster0.sch6n5t.mongodb.net/notesdb?retryWrites=true&w=majority&appName=Cluster0
```

**Important:** Never commit the `.env` file to git! It's already in `.gitignore`.
