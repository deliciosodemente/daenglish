# Cloudflare Workers Deployment Guide

This guide explains how to deploy the Live Audio application to Cloudflare Workers using Wrangler.

## Prerequisites

1. **Cloudflare Account**: Sign up at https://cloudflare.com
2. **Node.js**: Version 18 or higher
3. **Wrangler CLI**: Already installed as a dev dependency

## Setup

1. **Authenticate with Cloudflare**:
   ```bash
   npx wrangler login
   ```

2. **Build your application**:
   ```bash
   npm run build
   ```

3. **Test locally**:
   ```bash
   npm run dev:worker
   ```

## Deployment

### Option 1: Interactive Deployment
```bash
npm run deploy
```

### Option 2: Manual Deployment
```bash
npx wrangler deploy
```

### Option 3: Dry Run (Build Only)
```bash
npm run build:worker
```

## Configuration

The `wrangler.jsonc` file contains:
- **name**: Your worker name (live-audio)
- **main**: Entry point (src/index.ts)
- **compatibility_date**: Cloudflare compatibility date
- **assets**: Static files directory (dist)
- **ai**: AI binding for potential Gemini integration

## Environment Variables

Set your environment variables in the Cloudflare dashboard:

1. Go to Workers & Pages → Your Worker → Settings → Variables
2. Add `GEMINI_API_KEY` with your actual API key
3. The worker will access it via `env.GEMINI_API_KEY`

## Custom Domain (Optional)

1. In Cloudflare dashboard, go to your worker
2. Click "Triggers" tab
3. Add custom domain or subdomain
4. Configure DNS to point to your worker

## Monitoring

- Check worker logs in Cloudflare dashboard
- Monitor performance metrics
- Set up alerts for errors

## Rollback

If you need to rollback:
```bash
npx wrangler rollback
```

## Troubleshooting

### Common Issues:

1. **Build fails**: Ensure all dependencies are installed
2. **Worker not found**: Check wrangler.jsonc configuration
3. **Assets not loading**: Verify dist directory exists after build
4. **API key issues**: Ensure GEMINI_API_KEY is set in environment

### Debug Commands:
```bash
# Check worker status
npx wrangler status

# View logs
npx wrangler tail

# Test locally with logs
npm run dev:worker -- --log-level debug
```

## Updates

To deploy updates:
1. Make your changes
2. Run `npm run build`
3. Run `npm run deploy`

## Support

- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
- Issues: Check Cloudflare dashboard logs or use `npx wrangler tail`