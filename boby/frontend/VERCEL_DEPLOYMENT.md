# Vercel Deployment Guide for Boby Frontend

This guide will help you deploy the Boby frontend application to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com/) account
- Backend deployed to Railway (see `backend/RAILWAY_DEPLOYMENT.md`)
- Git repository with your code

## Step 1: Prepare Your Repository

Ensure your frontend code is in a Git repository (GitHub, GitLab, or Bitbucket).

## Step 2: Import Project to Vercel

### Option A: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Select your repository from the list

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd boby/frontend

# Deploy
vercel
```

## Step 3: Configure Project Settings

### Framework Preset
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Vercel should auto-detect these settings for Vite projects.

### Root Directory

If deploying from a monorepo, set the root directory to `boby/frontend`.

## Step 4: Configure Environment Variables

In your Vercel project settings, go to **Settings** → **Environment Variables** and add:

### Production Environment

```
VITE_API_URL=https://your-backend-app.up.railway.app
```

**Important:** Replace `your-backend-app.up.railway.app` with your actual Railway backend URL.

### Preview/Development Environments (Optional)

You can set different values for preview deployments:

- **Production:** Your Railway production URL
- **Preview:** Same as production or a staging backend
- **Development:** `http://localhost:8000`

## Step 5: Deploy

### Automatic Deployment

Vercel automatically deploys when you push to your Git repository:

1. Push changes to your main branch → Production deployment
2. Push to other branches → Preview deployment
3. Open pull requests → Preview deployment with unique URL

### Manual Deployment

Using Vercel CLI:

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## Step 6: Update Backend CORS Settings

After deployment, update your Railway backend's `ALLOWED_ORIGINS` environment variable:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-*.vercel.app
```

This allows:
- Your production domain: `https://your-app.vercel.app`
- Preview deployments: `https://your-app-git-*.vercel.app`

## Step 7: Verify Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Open browser DevTools → Console
3. Check for API connection logs
4. Test the application features

## Custom Domain (Optional)

### Add Custom Domain

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update backend CORS to include your custom domain

Example CORS configuration with custom domain:

```
ALLOWED_ORIGINS=https://boby.yourdomain.com,https://your-app.vercel.app
```

## Build Configuration

The project includes a [`vercel.json`](./vercel.json) configuration file:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures proper routing for single-page applications.

## Environment Variables Management

### Using .env Files

The project includes:
- `.env.example` - Template with all variables
- `.env.production` - Production-specific values (update before deploying)
- `.env` - Local development (git-ignored)

### Vercel Environment Variables

Set in Vercel dashboard under **Settings** → **Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.up.railway.app` | Production, Preview |

## Monitoring and Analytics

### Vercel Analytics

Enable Vercel Analytics for insights:

1. Go to **Analytics** tab in your project
2. Enable Web Analytics
3. View real-time traffic and performance metrics

### Error Tracking

Monitor errors in:
- **Deployments** → **Functions** → Logs
- Browser console for client-side errors
- Railway logs for backend errors

## Troubleshooting

### Build Failures

**Issue:** Build fails with dependency errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Errors

**Issue:** Frontend can't connect to backend

**Solutions:**
1. Verify `VITE_API_URL` is set correctly in Vercel
2. Check Railway backend is running
3. Verify CORS settings in Railway backend
4. Check browser console for specific errors

### Environment Variables Not Working

**Issue:** Environment variables not available in production

**Solutions:**
1. Ensure variables are prefixed with `VITE_`
2. Redeploy after adding/changing variables
3. Check variable is set for correct environment (Production/Preview)

### Routing Issues

**Issue:** Direct URL access returns 404

**Solution:** Ensure `vercel.json` includes the rewrite rule:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Performance Optimization

### Enable Compression

Vercel automatically enables gzip/brotli compression.

### Caching

Vercel automatically caches static assets. The build output includes:
- Hashed filenames for cache busting
- Optimized chunks for faster loading

### Image Optimization

If using images, consider:
- Using WebP format
- Implementing lazy loading
- Using Vercel's Image Optimization (for Next.js projects)

## Security Best Practices

1. **Environment Variables:** Never commit `.env` files
2. **HTTPS Only:** Vercel provides SSL automatically
3. **CORS:** Restrict backend CORS to your Vercel domains only
4. **Dependencies:** Regularly update dependencies
5. **Secrets:** Use Vercel's environment variables for sensitive data

## Deployment Checklist

Before deploying to production:

- [ ] Backend deployed to Railway
- [ ] `VITE_API_URL` set in Vercel environment variables
- [ ] Backend CORS includes Vercel domain
- [ ] Test all features in preview deployment
- [ ] Check browser console for errors
- [ ] Verify API calls are working
- [ ] Test on mobile devices
- [ ] Review Vercel deployment logs

## Rollback

If a deployment has issues:

1. Go to **Deployments** in Vercel dashboard
2. Find a previous working deployment
3. Click **"..."** → **"Promote to Production"**

## CI/CD Integration

Vercel automatically integrates with:
- GitHub
- GitLab
- Bitbucket

Every push triggers:
- Automatic builds
- Preview deployments for PRs
- Production deployment for main branch

## Cost Considerations

- Vercel offers a generous free tier
- Free tier includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic SSL
  - Preview deployments
- Monitor usage in **Settings** → **Usage**

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
- Boby Issues: [Your GitHub Issues URL]

## Next Steps

After deploying the frontend:

1. Test the complete application flow
2. Set up custom domain (optional)
3. Enable Vercel Analytics
4. Configure monitoring and alerts
5. Share the application URL with users

## Updating Your Deployment

Vercel automatically redeploys on Git push:

1. Make changes to your code
2. Commit and push to your repository
3. Vercel automatically builds and deploys
4. Preview URL available immediately
5. Merge to main for production deployment

## Preview Deployments

Every pull request gets a unique preview URL:

- Automatically generated on PR creation
- Updated on every commit
- Perfect for testing before merging
- Share with team for review

Example preview URL:
```
https://your-app-git-feature-branch-username.vercel.app