# Railway Deployment Guide for Boby Backend

This guide will help you deploy the Boby backend API to Railway.

## Prerequisites

- A [Railway](https://railway.app/) account
- IBM Watsonx AI credentials (API key and Project ID)
- Git repository with your code

## Step 1: Prepare Your Repository

Ensure your backend code is in a Git repository (GitHub, GitLab, or Bitbucket).

## Step 2: Create a New Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your repositories
5. Select your repository
6. Choose the `boby/backend` directory as the root path (if Railway supports monorepos) or deploy from a separate backend repository

## Step 3: Configure Environment Variables

In your Railway project dashboard, go to **Variables** and add the following:

### Required Variables

```
WATSONX_API_KEY=your_watsonx_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### CORS Configuration

```
ALLOWED_ORIGINS=https://your-frontend-app.vercel.app
```

**Important:** Replace `your-frontend-app.vercel.app` with your actual Vercel frontend URL. You can add multiple origins separated by commas:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-preview.vercel.app
```

### Optional Variables

```
CACHE_ENABLED=true
CACHE_TTL=3600
```

## Step 4: Configure Build Settings

Railway should automatically detect your Python application. The deployment uses:

- **Build Command:** Automatically installs dependencies from `requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

The `railway.json` file in the backend directory configures these settings.

## Step 5: Deploy

1. Railway will automatically deploy your application
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, Railway will provide you with a public URL (e.g., `https://your-app.up.railway.app`)

## Step 6: Verify Deployment

Test your API endpoints:

```bash
# Health check
curl https://your-app.up.railway.app/

# Test analyze endpoint
curl -X POST https://your-app.up.railway.app/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "/path/to/repo"}'
```

## Step 7: Update Frontend Configuration

Update your frontend's `.env` file with the Railway backend URL:

```
VITE_API_URL=https://your-app.up.railway.app
```

## Monitoring and Logs

- View logs in the Railway dashboard under **Deployments** → **Logs**
- Monitor resource usage in the **Metrics** tab
- Set up alerts for errors or high resource usage

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. Verify `ALLOWED_ORIGINS` includes your frontend URL
2. Ensure the URL matches exactly (including https://)
3. Check Railway logs for CORS-related messages

### Import Errors

If you see module import errors:

1. Verify all dependencies are in `requirements.txt`
2. Check the build logs for installation errors
3. Ensure Python version compatibility

### Port Binding Issues

Railway automatically sets the `PORT` environment variable. The application uses:

```python
uvicorn main:app --host 0.0.0.0 --port $PORT
```

This is configured in `Procfile` and `railway.json`.

## Updating Your Deployment

Railway automatically redeploys when you push to your connected Git branch:

1. Make changes to your code
2. Commit and push to your repository
3. Railway will automatically detect changes and redeploy

## Cost Considerations

- Railway offers a free tier with limited resources
- Monitor your usage in the Railway dashboard
- Consider upgrading to a paid plan for production workloads

## Security Best Practices

1. **Never commit `.env` files** - Use Railway's environment variables
2. **Rotate API keys regularly** - Update in Railway dashboard
3. **Use HTTPS only** - Railway provides SSL certificates automatically
4. **Limit CORS origins** - Only allow your frontend domains
5. **Monitor logs** - Check for suspicious activity

## Support

- Railway Documentation: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- Boby Issues: [Your GitHub Issues URL]

## Next Steps

After deploying the backend:

1. Deploy the frontend to Vercel (see `VERCEL_DEPLOYMENT.md`)
2. Update frontend environment variables with Railway URL
3. Test the full application end-to-end
4. Set up monitoring and alerts