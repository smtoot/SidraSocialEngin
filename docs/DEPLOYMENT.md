# 🚀 Sidra Content Factory - Deployment Guide

## Overview

This guide covers deploying Sidra Content Factory to production using Docker and GitHub Actions.

## Prerequisites

- Server with Ubuntu 20.04+ (or any Linux distro)
- Docker and Docker Compose installed
- Git
- SSH access to server

## Environment Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd sidra-content-factory
```

### 2. Environment Variables
Copy the example environment files and configure them:

```bash
# Backend environment
cp backend/.env.example backend/.env

# Root environment
cp .env.example .env
```

Configure the following variables:

**Backend (.env):**
```bash
DATABASE_URL=postgresql://sidra_user:sidra_password@postgres:5432/sidra_factory
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=sidra_user
DB_PASSWORD=sidra_password
DB_NAME=sidra_factory

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

OPENAI_API_KEY=your-openai-api-key-here

PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

**Production Docker Compose (.env):**
```bash
DB_USERNAME=sidra_user
DB_PASSWORD=sidra_password
DB_NAME=sidra_factory
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key-here
FRONTEND_API_URL=https://your-domain.com/api
```

## Deployment Options

### Option 1: Manual Docker Deployment

1. **Build and start services:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

2. **Initialize database:**
```bash
docker-compose exec postgres psql -U sidra_user -d sidra_factory -f /docker-entrypoint-initdb.d/init.sql
```

3. **Check services:**
```bash
docker-compose ps
```

### Option 2: GitHub Actions CI/CD (Recommended)

1. **Set up GitHub Secrets:**
   - `HOST`: Your server IP address
   - `USERNAME`: SSH username
   - `SSH_KEY`: Private SSH key content
   - `OPENAI_API_KEY`: Your OpenAI API key

2. **Configure server for SSH deployment:**
```bash
# Create deployment directory
sudo mkdir -p /opt/sidra-content-factory
sudo chown $USER:$USER /opt/sidra-content-factory

# Clone repo
git clone <your-repo-url> /opt/sidra-content-factory
cd /opt/sidra-content-factory

# Configure environment files
cp backend/.env.example backend/.env
cp .env.example .env
# Edit the files with your production values
```

3. **Push to main branch:**
```bash
git add .
git commit -m "Setup production deployment"
git push origin main
```

The GitHub Actions workflow will automatically deploy to your server.

## SSL/HTTPS Setup

### Using Nginx as Reverse Proxy

1. **Install Nginx:**
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

2. **Create Nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/sidra-content-factory
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Enable site and SSL:**
```bash
sudo ln -s /etc/nginx/sites-available/sidra-content-factory /etc/nginx/sites-enabled/
sudo certbot --nginx -d your-domain.com
```

## Database Management

### Backup Database
```bash
docker-compose exec postgres pg_dump -U sidra_user sidra_factory > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U sidra_user sidra_factory < backup.sql
```

### Access Database
```bash
docker-compose exec postgres psql -U sidra_user -d sidra_factory
```

## Monitoring and Logs

### View Application Logs
```bash
# Frontend logs
docker-compose logs -f frontend

# Backend logs
docker-compose logs -f backend

# Database logs
docker-compose logs -f postgres
```

### Health Checks
- Frontend: `https://your-domain.com`
- Backend: `https://your-domain.com/api`
- API Docs: `https://your-domain.com/api/docs`

## Scaling and Performance

### Using Multiple Backend Instances
```yaml
# docker-compose.prod.yml
backend:
  deploy:
    replicas: 3
  # ... rest of configuration
```

### Database Optimization
- Configure connection pooling in production
- Set up read replicas for high traffic
- Implement proper indexing strategies

## Security Considerations

1. **Change default passwords**
2. **Use strong JWT secrets**
3. **Enable firewall**
4. **Regular updates**
5. **Monitor access logs**

## Troubleshooting

### Common Issues

1. **Container won't start:**
```bash
# Check logs
docker-compose logs <service-name>

# Check resource usage
docker stats
```

2. **Database connection issues:**
```bash
# Verify database is running
docker-compose ps postgres

# Test connection
docker-compose exec backend npm run typeorm query "SELECT 1"
```

3. **SSL certificate issues:**
```bash
# Renew certificates
sudo certbot renew

# Test nginx configuration
sudo nginx -t
```

## Production Best Practices

1. **Regular backups**
2. **Monitoring setup (Prometheus/Grafana)**
3. **Log aggregation (ELK stack)**
4. **Load testing**
5. **Security scanning**
6. **Database query optimization**

## Support

For deployment issues:
1. Check logs
2. Verify environment variables
3. Test database connectivity
4. Review GitHub Actions workflow logs