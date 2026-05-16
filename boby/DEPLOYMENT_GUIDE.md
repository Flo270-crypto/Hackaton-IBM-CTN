# Boby Deployment Guide

Complete guide for deploying Boby to production with Railway (backend) and Vercel (frontend).

## Overview

- **Backend:** FastAPI application deployed to Railway
- **Frontend:** React + Vite application deployed to Vercel
- **Database:** None (stateless API)
- **External Services:** IBM Watsonx AI

## Architecture

```
┌─────────────────┐
│   Vercel        │
│   (Frontend)    │
│   React + Vite  │
└────────┬────────┘
         │ HTTPS
         │
┌────────▼────────┐
│   Railway       │
│   (Backend)     │
│   FastAPI       │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│  IBM Watsonx AI │
│  (LLM Service)  │
└─────────────────┘
```

## Prerequisites

Before starting, ensure you have:

- [ ] Git repository with Boby code
- [ ] [Railway](https://railway.app/) account
- [ ] [Vercel](https://vercel.com/) account
- [ ] IBM Watsonx AI credentials:
  - API Key
  - Project ID
  - Service URL

## Quick Start

### 1. Deploy Backend to Railway (15 minutes)

```bash
# Navigate to backend directory
cd boby/backend

# Ensure all files are committed
git add .
git commit -m "Prepare for Railway deployment"
git push
```

Follow the detailed guide: [`backend/RAILWAY_DEPLOYMENT.md`](./backend/RAILWAY_DEPLOYMENT.md)

**Key Steps:**
1. Create new Railway project
2. Connect Git repository
3. Set environment variables (Watsonx credentials)
4. Deploy automatically
5. Note your Railway URL (e.g., `https://your-app.up.railway.app`)

### 2. Deploy Frontend to Vercel (10 minutes)

```bash
# Navigate to frontend directory
cd boby/frontend

# Update .env.production with Railway URL
echo "VITE_API_URL=https://your-app.up.railway.app" > .env.production

# Commit changes
git add .env.production
git commit -m "Configure production API URL"
git push
```

Follow the detailed guide: [`frontend/VERCEL_DEPLOYMENT.md`](./frontend/VERCEL_DEPLOYMENT.md)

**Key Steps:**
1. Import project to Vercel
2. Set environment variable: `VITE_API_URL`
3. Deploy automatically
4. Note your Vercel URL (e.g., `https://your-app.vercel.app`)

### 3. Update CORS Settings (5 minutes)

Update Railway backend environment variables:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-*.vercel.app
```

This allows your Vercel frontend to communicate with the Railway backend.

### 4. Verify Deployment (5 minutes)

1. Visit your Vercel URL
2. Open browser DevTools (F12)
3. Check Console for API connection
4. Test application features

## Detailed Deployment Steps

### Step 1: Prepare Your Repository

Ensure your repository structure is correct:

```
boby/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── Procfile
│   ├── railway.json
│   ├── .env.example
│   └── RAILWAY_DEPLOYMENT.md
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   ├── .env.example
│   ├── .env.production
│   └── VERCEL_DEPLOYMENT.md
└── DEPLOYMENT_GUIDE.md (this file)
```

### Step 2: Deploy Backend to Railway

#### 2.1 Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select `boby/backend` as root directory (if supported)

#### 2.2 Configure Environment Variables

In Railway project settings, add:

```bash
# IBM Watsonx AI
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# CORS (update after Vercel deployment)
ALLOWED_ORIGINS=http://localhost:5173
```

#### 2.3 Verify Deployment

```bash
# Test health endpoint
curl https://your-app.up.railway.app/

# Test analyze endpoint
curl -X POST https://your-app.up.railway.app/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "/test/path"}'
```

### Step 3: Deploy Frontend to Vercel

#### 3.1 Import to Vercel

**Option A: Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Set root directory to `boby/frontend`

**Option B: Vercel CLI**
```bash
npm i -g vercel
cd boby/frontend
vercel
```

#### 3.2 Configure Environment Variables

In Vercel project settings:

```bash
VITE_API_URL=https://your-app.up.railway.app
```

#### 3.3 Verify Deployment

Visit your Vercel URL and test:
- Application loads correctly
- API calls work (check browser console)
- All features function properly

### Step 4: Update CORS Configuration

Return to Railway and update `ALLOWED_ORIGINS`:

```bash
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-*.vercel.app
```

This allows:
- Production deployments: `https://your-app.vercel.app`
- Preview deployments: `https://your-app-git-*.vercel.app`

### Step 5: Test End-to-End

1. Open your Vercel URL
2. Test each feature:
   - Repository analysis
   - Impact analysis
   - Smart checklist generation
   - History tracking
   - Push guardian
   - Merge intelligence

## Environment Variables Reference

### Backend (Railway)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `WATSONX_API_KEY` | Yes | IBM Watsonx API key | `your_api_key` |
| `WATSONX_PROJECT_ID` | Yes | IBM Watsonx project ID | `your_project_id` |
| `WATSONX_URL` | Yes | IBM Watsonx service URL | `https://us-south.ml.cloud.ibm.com` |
| `ALLOWED_ORIGINS` | Yes | Allowed CORS origins | `https://your-app.vercel.app` |
| `CACHE_ENABLED` | No | Enable response caching | `true` |
| `CACHE_TTL` | No | Cache time-to-live (seconds) | `3600` |

### Frontend (Vercel)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `https://your-app.up.railway.app` |
| `VITE_WORKSPACE_PATH` | No | Default workspace path | `/path/to/workspace` |

## Troubleshooting

### CORS Errors

**Symptom:** Browser console shows CORS errors

**Solutions:**
1. Verify `ALLOWED_ORIGINS` in Railway includes your Vercel URL
2. Ensure URL matches exactly (including `https://`)
3. Check Railway logs for CORS-related messages
4. Redeploy Railway after changing environment variables

### API Connection Failed

**Symptom:** Frontend can't connect to backend

**Solutions:**
1. Verify `VITE_API_URL` is set correctly in Vercel
2. Check Railway backend is running (view logs)
3. Test backend directly with curl
4. Check browser console for specific error messages

### Build Failures

**Backend Build Fails:**
```bash
# Check requirements.txt is complete
# Verify Python version compatibility
# Review Railway build logs
```

**Frontend Build Fails:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build

# Check for TypeScript errors
# Verify all dependencies are installed
```

### Environment Variables Not Working

**Solutions:**
1. Ensure variables are set in correct environment (Production/Preview)
2. Frontend variables must be prefixed with `VITE_`
3. Redeploy after adding/changing variables
4. Check variable names for typos

## Monitoring

### Railway Backend

- **Logs:** Railway Dashboard → Deployments → Logs
- **Metrics:** Railway Dashboard → Metrics
- **Alerts:** Set up in Railway settings

### Vercel Frontend

- **Logs:** Vercel Dashboard → Deployments → Function Logs
- **Analytics:** Enable in Vercel Dashboard → Analytics
- **Performance:** View in Analytics tab

### Health Checks

Set up monitoring with:
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)
- [Better Uptime](https://betteruptime.com/)

Monitor these endpoints:
- Backend: `https://your-app.up.railway.app/`
- Frontend: `https://your-app.vercel.app/`

## Scaling

### Railway Backend

- **Vertical Scaling:** Upgrade Railway plan for more resources
- **Horizontal Scaling:** Railway Pro plan supports multiple instances
- **Caching:** Enable response caching to reduce load

### Vercel Frontend

- **Automatic Scaling:** Vercel scales automatically
- **Edge Network:** Content served from global CDN
- **Optimization:** Vite builds are optimized automatically

## Security Checklist

- [ ] Environment variables set (not hardcoded)
- [ ] CORS restricted to frontend domains only
- [ ] HTTPS enabled (automatic on Railway/Vercel)
- [ ] API keys rotated regularly
- [ ] Dependencies updated regularly
- [ ] Error messages don't expose sensitive data
- [ ] Rate limiting configured (if needed)

## Cost Estimation

### Free Tier Limits

**Railway:**
- $5 free credit per month
- Enough for small projects
- Monitor usage in dashboard

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic SSL included

**IBM Watsonx AI:**
- Check your IBM Cloud plan
- Monitor API usage
- Set up billing alerts

### Upgrade Considerations

Upgrade when you need:
- More Railway compute resources
- Higher Vercel bandwidth
- Additional Watsonx AI capacity
- Custom domains
- Team collaboration features

## Maintenance

### Regular Tasks

**Weekly:**
- Check error logs
- Monitor resource usage
- Review API response times

**Monthly:**
- Update dependencies
- Review security advisories
- Rotate API keys (if policy requires)
- Check cost/usage reports

**Quarterly:**
- Performance optimization review
- Security audit
- Backup configuration review

### Updating Deployments

**Backend Updates:**
```bash
git add .
git commit -m "Update backend"
git push
# Railway auto-deploys
```

**Frontend Updates:**
```bash
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys
```

## Rollback Procedures

### Railway Rollback

1. Go to Railway Dashboard → Deployments
2. Find previous working deployment
3. Click "Redeploy"

### Vercel Rollback

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Support

### Documentation

- Railway: https://docs.railway.app/
- Vercel: https://vercel.com/docs
- IBM Watsonx: https://www.ibm.com/docs/en/watsonx-as-a-service

### Community

- Railway Discord: https://discord.gg/railway
- Vercel Community: https://github.com/vercel/vercel/discussions
- Boby Issues: [Your GitHub Issues URL]

## Next Steps

After successful deployment:

1. [ ] Set up custom domain (optional)
2. [ ] Enable monitoring and alerts
3. [ ] Configure backup strategy
4. [ ] Document API endpoints
5. [ ] Create user documentation
6. [ ] Set up CI/CD workflows
7. [ ] Plan scaling strategy
8. [ ] Schedule regular maintenance

## Conclusion

You now have Boby deployed to production! 🎉

- **Backend:** Running on Railway
- **Frontend:** Running on Vercel
- **Monitoring:** Set up health checks
- **Security:** CORS and HTTPS configured

For detailed platform-specific instructions, see:
- [`backend/RAILWAY_DEPLOYMENT.md`](./backend/RAILWAY_DEPLOYMENT.md)
- [`frontend/VERCEL_DEPLOYMENT.md`](./frontend/VERCEL_DEPLOYMENT.md)