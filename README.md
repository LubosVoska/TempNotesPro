# TempNotes

A modern React application for creating temporary notes with customizable expiration times and todo lists using browser storage.

## Features

- Create and manage temporary notes with custom expiration times
- Add todo lists within notes
- Tags for better organization and filtering
- Light and dark theme support
- "Never expire" option for permanent notes
- Search functionality 
- All data stored in browser storage for privacy
- SEO optimized
- Google AdSense integration

## Deployment on Vercel

This application is configured for easy deployment to Vercel. Follow these steps to deploy:

### Prerequisites

- A Vercel account
- Your Google AdSense Publisher ID (if you want to monetize with ads)

### Steps to Deploy

1. **Fork or Clone the Repository**
   
   Make sure you have the latest version of the code.

2. **Install Vercel CLI (Optional)**
   
   ```bash
   npm install -g vercel
   ```

3. **Set up Environment Variables**
   
   In Vercel, add the following environment variable:
   - `VITE_GOOGLE_ADSENSE_ID`: Your Google AdSense Publisher ID

4. **Deploy Using Vercel Dashboard**
   
   - Import your repository in the Vercel dashboard
   - Vercel will automatically detect the configuration
   - Add the required environment variables
   - Deploy!

   Alternatively, use the CLI:
   ```bash
   vercel
   ```

5. **Setting up a Custom Domain (Optional)**
   
   - Add your custom domain in the Vercel dashboard
   - Update the URLs in:
     - `public/robots.txt`
     - `public/sitemap.xml`
     - `client/index.html` (meta tags)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## Environment Variables

- `VITE_GOOGLE_ADSENSE_ID`: Your Google AdSense Publisher ID for ad monetization

## License

MIT