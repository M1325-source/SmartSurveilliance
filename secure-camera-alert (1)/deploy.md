# Smart Surveillance App - Deployment Guide

## Deployment Options

This Smart Surveillance App can be deployed using multiple methods:

### 1. Netlify (Recommended for Static Hosting)

1. Connect your repository to Netlify
2. Build settings are automatically configured via `netlify.toml`
3. Deploy command: `npm run build`
4. Publish directory: `dist`

### 2. Vercel

1. Connect your repository to Vercel
2. Configuration is handled by `vercel.json`
3. Automatic deployments on git push

### 3. Docker

```bash
# Build the Docker image
docker build -t smart-surveillance-app .

# Run the container
docker run -p 80:80 smart-surveillance-app
```

### 4. Manual Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in the 'dist' directory
# Upload these files to any static hosting service
```

## Environment Variables

No environment variables are required for the basic deployment as the app uses simulated data.

## Features Included

- Real-time crime detection simulation
- Multi-camera surveillance dashboard
- SOS alert system
- Face detection and sentiment analysis
- Responsive design with dark theme
- Live data updates and notifications

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance

- Optimized build with Vite
- Code splitting and lazy loading
- Compressed assets
- Efficient React components