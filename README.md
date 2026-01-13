# Necrux Guild - Wild Rift Esports Website

Elite competitive Wild Rift guild website featuring professional design, smooth animations, and full responsiveness.

## 🎮 About Necrux

Necrux is a competitive Wild Rift esports guild dedicated to excellence, teamwork, and dominating the rift. We compete in regional and international tournaments with elite players.

## 🚀 Features

- **Professional Design**: Modern cyberpunk aesthetic with cyan/blue theme
- **Smooth Animations**: GSAP-powered scroll animations and micro-interactions
- **Particle Background**: Interactive canvas particle system in hero section
- **Fully Responsive**: Mobile-first design, optimized for all devices
- **Accessible**: WCAG compliant with reduced-motion support and keyboard navigation
- **SEO Optimized**: Semantic HTML, meta tags, structured data, sitemap
- **Fast Performance**: Optimized assets, lazy loading, minimal dependencies

## 📁 Project Structure

```bash
necrux/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── main.js         # JavaScript animations & interactions
│   ├── images/             # Image assets
│   │   ├── logo-full.png   # Full logo (add your PNG here)
│   │   ├── logo-icon.png   # Icon/favicon logo
│   │   └── players/        # Player images
│   └── animations/         # Lottie JSON files (optional)
├── robots.txt              # Search engine crawling rules
├── sitemap.xml             # Site structure for SEO
├── CNAME                   # Custom domain configuration
└── README.md               # This file
```

## 🎨 Customization

### Adding Your Logo

1. Place your PNG logo in `assets/images/`:
   - `logo-full.png` - Full logo for hero (recommended: 2400x800px)
   - `logo-icon.png` - Square icon (512x512px) for favicon
   - `logo-optimized.png` - General use (1200x400px)

2. Optimize with [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)

### Updating Content

#### Roster

Edit player cards in `index.html` (Roster section):

```html
<div class="player-card" data-role="jungle">
    <div class="player-image">
        <img src="assets/images/players/name.jpg" alt="Player Name" />
    </div>
    <div class="player-info">
        <h3 class="player-name">Player Name</h3>
        <p class="player-specialty">Your specialty</p>
    </div>
</div>
```

#### Schedule

Update match cards in `index.html` (Schedule section)

#### Discord Link

Update in `assets/js/main.js`:

```javascript
const DISCORD_INVITE = 'https://discord.gg/your-invite-code';
```

### Colors

Modify CSS variables in `assets/css/style.css` (near the top of the file):

```css
:root {
    --color-primary: #00FFFF;    /* Cyan */
    --color-secondary: #0055FF;  /* Blue */
    --color-accent: #FF00FF;     /* Magenta */
}
```

### Fonts

Current fonts (Google Fonts):

- **Orbitron**: Headings (futuristic, bold)
- **Rajdhani**: Body text (modern, readable)

Change the Google Fonts link in `index.html` head and CSS variables

## 🌐 Deployment

### GitHub Pages Setup

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Source: `main` branch, root folder
   - Save

3. **Custom Domain (if using):**
   - Update `CNAME` file with your domain
   - Configure DNS (see Cloudflare section)

### Cloudflare Configuration

1. **Add Domain to Cloudflare:**
   - Sign up at [cloudflare.com](https://cloudflare.com)
   - Add your domain
   - Update nameservers at registrar

2. **DNS Settings:**
   Create A records pointing to GitHub Pages IPs:

   ```text
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   Create CNAME for www:

   ```text
   www → yourusername.github.io
   ```

3. **SSL/TLS:**
   - Set encryption mode to "Full"
   - Enable "Always Use HTTPS"
   - Enable "Automatic HTTPS Rewrites"

4. **Performance:**
   - Enable "Auto Minify" (HTML, CSS, JS)
   - Enable "Brotli" compression
   - Set "Browser Cache TTL" to 4 hours
   - Page Rule: `*necrux.gg/assets/*` → Cache Everything, 1 month TTL

## 🛠️ Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/necrux.git
   cd necrux
   ```

2. **Open in browser:**
   - Simply open `index.html` in your browser
   - Or use a local server:

   ```bash
   python -m http.server 8000
   # Visit <http://localhost:8000>
   ```

3. **Make changes:**
   - Edit HTML, CSS, JS files
   - Refresh browser to see changes
   - Test on mobile with DevTools

## 📊 Performance Tips

- **Images**: Use WebP/AVIF with PNG fallbacks, optimize to <100KB each
- **Lazy Loading**: Images below fold load only when scrolled into view
- **Reduced Motion**: Animations disabled for users with motion sensitivity
- **Mobile Optimization**: Particle count reduced on mobile devices

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators on all interactive elements
- Skip-to-content link
- Alt text on all images
- Color contrast WCAG AA compliant

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🤝 Contributing

Want to join Necrux or contribute?

- Join our Discord: [Update with your link]
- Fill out recruitment form on website
- Follow us on social media

## 📄 License

© 2026 Necrux Guild. All rights reserved.

## 🙋 Support

For technical issues or questions:

- Open an issue on GitHub
- Contact via Discord
- Email: [your-email]

---

### Built with ❤️ by Necrux Guild
