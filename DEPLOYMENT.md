# Deployment Guide - Live Audio v0.0.1

## Quick Start

### Prerequisites
- Node.js 18+ 
- Gemini API Key

### 1. Environment Setup
```bash
# Copy and configure your API key
cp .env.local .env.production
# Edit .env.production with your actual GEMINI_API_KEY
```

### 2. Deploy Options

#### Option A: Traditional Server
```bash
# Run deployment script
./deploy.sh  # Linux/Mac
# or
deploy.bat   # Windows

# Serve the dist folder with any web server
# Example with Python:
cd dist && python -m http.server 8000
```

#### Option B: Docker (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Option C: Manual Build
```bash
npm ci
npm run build
npm start  # Serves on port 3000
```

### 3. Server Configuration

#### Nginx Example
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Apache Example
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

### 4. Health Checks
- Application: `http://localhost:3000/health`
- Docker: `docker-compose ps`
- Process: `curl -f http://localhost:3000/health`

### 5. Monitoring
- Logs: `docker-compose logs -f`
- Resource usage: `docker stats`
- Uptime: Check health endpoint

## Version Control

### Current Version: 0.0.1
- Check `VERSION` file for current version
- See `CHANGELOG.md` for version history
- Use Git tags for releases: `git tag v0.0.1`

### Updating Versions
1. Update version in `package.json`
2. Update `VERSION` file
3. Update `CHANGELOG.md`
4. Create new Git tag
5. Rebuild and redeploy

## Troubleshooting

### Common Issues
1. **Build fails**: Check Node.js version and dependencies
2. **API errors**: Verify GEMINI_API_KEY in environment
3. **Port conflicts**: Change port in docker-compose.yml or package.json
4. **Docker issues**: Check Docker daemon and permissions

### Support
- Check application logs
- Verify environment variables
- Test health endpoints
- Review Docker/container status