# 🚀 Deployment Guide - Necrux Guild Website

Complete guide for deploying your Wild Rift guild website to GitHub Pages with Cloudflare.

## 📋 Prerequisites

- [x] Website files created (index.html, CSS, JS)
- [ ] Assets prepared (logo, images - see ASSET_SETUP.md)
- [ ] GitHub account
- [ ] Custom domain (optional, for Cloudflare)
- [ ] Cloudflare account (optional, for CDN/SSL)

## 🎯 Deployment Steps

### Phase 1: Local Testing

**1. Test Locally**

Open in browser:
```bash
# Navigate to project directory
cd c:\NCXDevelopment\Programming\necrux

# Option 1: Open directly
start index.html

# Option 2: Use local server (recommended)
python -m http.server 8000
# Visit http://localhost:8000
```

**2. Verify Everything Works**
- [ ] Logo displays (or placeholder visible)
- [ ] Navigation menu works (mobile & desktop)
- [ ] Smooth scroll to sections
- [ ] Animations trigger on scroll
- [ ] Contact form displays correctly
- [ ] Footer links work
- [ ] No console errors (F12 → Console)

### Phase 2: GitHub Repository Setup

**1. Initialize Git (if not already done)**

```bash
cd c:\NCXDevelopment\Programming\necrux
git init
git add .
git commit -m "Initial commit: Necrux Guild website"
```

**2. Create GitHub Repository**

- Go to [github.com/new](https://github.com/new)
- Repository name: `necrux` (or your choice)
- Description: "Elite Wild Rift esports guild website"
- Public repository
- Do NOT initialize with README (you already have one)
- Click "Create repository"

**3. Push to GitHub**

```bash
# Link to your GitHub repo (replace YOUR-USERNAME)
git remote add origin https://github.com/JinxedMyPants/necrux.git

# Push code
git branch -M main
git push -u origin main
```

### Phase 3: Enable GitHub Pages

**1. Configure GitHub Pages**

- Go to your repository on GitHub
- Click **Settings** (top right)
- Scroll to **Pages** (left sidebar)
- Under "Source":
  - Branch: `main`
  - Folder: `/ (root)`
- Click **Save**

**2. Wait for Deployment**

- GitHub will build your site (takes 1-3 minutes)
- You'll see: "Your site is published at https://JinxedMyPants.github.io/necrux/"
- Click the URL to verify

**3. Enable HTTPS (Important!)**

- Still in Settings → Pages
- Check: ✅ **Enforce HTTPS**
- Save

### Phase 4: Custom Domain (Optional)

**If you have a custom domain (e.g., necrux.gg):**

**1. Check CNAME File**

Your CNAME file should contain just your domain:
```
necrux.gg
```

OR if using www subdomain:
```
www.necrux.gg
```

**2. Update in GitHub**

- In repo Settings → Pages
- Under "Custom domain"
- Enter: `necrux.gg` (or your domain)
- Click **Save**
- Wait for DNS check (takes a few minutes)

**3. Proceed to Cloudflare Setup** (see Phase 5)

### Phase 5: Cloudflare Configuration

**Why Cloudflare?**
- Free SSL certificate
- Global CDN (faster loading worldwide)
- DDoS protection
- Caching (improved performance)
- Analytics

**1. Add Domain to Cloudflare**

- Go to [dash.cloudflare.com](https://dash.cloudflare.com/)
- Click **Add a Site**
- Enter your domain: `necrux.gg`
- Select **Free Plan**
- Click **Continue**

**2. Update Nameservers**

- Cloudflare will show you 2 nameservers (e.g., `nora.ns.cloudflare.com`)
- Go to your domain registrar (GoDaddy, Namecheap, etc.)
- Find "Nameservers" or "DNS Settings"
- Replace with Cloudflare's nameservers
- Save changes
- Wait for propagation (2-24 hours, usually <1 hour)

**3. Configure DNS Records**

In Cloudflare DNS settings, add these records:

**For Apex Domain (necrux.gg):**

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | @ | 185.199.108.153 | Proxied (🟠) |
| A | @ | 185.199.109.153 | Proxied (🟠) |
| A | @ | 185.199.110.153 | Proxied (🟠) |
| A | @ | 185.199.111.153 | Proxied (🟠) |

**For WWW Subdomain:**

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | www | JinxedMyPants.github.io | Proxied (🟠) |

**4. SSL/TLS Settings**

- Go to **SSL/TLS** tab
- Set encryption mode: **Full** (NOT Full Strict)
  - GitHub Pages uses flexible SSL
- Go to **SSL/TLS → Edge Certificates**
- Enable: ✅ **Always Use HTTPS**
- Enable: ✅ **Automatic HTTPS Rewrites**
- Optional: Enable **HSTS** (after confirming site works)

**5. Caching & Performance**

Go to **Caching** tab:
- Caching Level: **Standard**
- Browser Cache TTL: **4 hours** or **Respect Existing Headers**

Go to **Speed → Optimization**:
- Enable: ✅ **Auto Minify** (HTML, CSS, JavaScript)
- Enable: ✅ **Brotli**

**6. Page Rules (Optional but Recommended)**

Go to **Rules → Page Rules**:

**Rule 1: Cache Static Assets**
- URL: `necrux.gg/assets/*`
- Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
- Save and Deploy

**Rule 2: Force HTTPS on Apex**
- URL: `http://necrux.gg/*`
- Setting: Always Use HTTPS
- Save and Deploy

**7. Purge Cache After Deployment**

- Go to **Caching** tab
- Click **Purge Everything**
- Do this after every update to your site

### Phase 6: Verify Deployment

**1. DNS Propagation Check**

- Visit [dnschecker.org](https://dnschecker.org/)
- Enter your domain: `necrux.gg`
- Verify A records point to GitHub Pages IPs
- Check multiple locations (should be green)

**2. SSL Certificate Check**

- Visit [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)
- Enter your domain
- Should get A or A+ rating (wait 24h if pending)

**3. Site Functionality Test**

Visit your domain and test:
- [ ] HTTPS works (padlock in browser)
- [ ] HTTP redirects to HTTPS
- [ ] www redirects to apex (or vice versa)
- [ ] Navigation works
- [ ] Animations load
- [ ] Images display
- [ ] Contact form visible
- [ ] Mobile responsive

**4. Performance Check**

- Visit [pagespeed.web.dev](https://pagespeed.web.dev/)
- Enter your domain
- Test mobile and desktop
- Aim for score >90

**5. Social Media Preview**

- Visit [metatags.io](https://metatags.io/)
- Enter your domain
- Verify Open Graph image and description
- Test on Facebook, Twitter preview

## 🔄 Updating Your Site

**To make changes:**

```bash
# Make edits to files
# Test locally

# Commit and push
git add .
git commit -m "Update: describe your changes"
git push origin main

# Wait 1-2 minutes for GitHub Pages to rebuild
# Purge Cloudflare cache (if using):
# Go to Cloudflare → Caching → Purge Everything
```

## ⚡ Quick Reference

### Your Site URLs

- GitHub Pages (default): `https://JinxedMyPants.github.io/necrux/`
- Custom Domain (if configured): `https://necrux.gg/`

### Important Links

- **Repository**: [github.com/JinxedMyPants/necrux](https://github.com/JinxedMyPants/necrux)
- **GitHub Pages Settings**: Repo → Settings → Pages
- **Cloudflare Dashboard**: [dash.cloudflare.com](https://dash.cloudflare.com/)

### Key Files for Deployment

- `CNAME` - Custom domain configuration
- `robots.txt` - Search engine crawling rules
- `sitemap.xml` - Site structure for SEO
- `.gitignore` - Files to exclude from Git

## 🐛 Troubleshooting

### Site Not Loading

**Problem:** 404 error on GitHub Pages URL
- **Solution:** Check Settings → Pages, verify branch is `main` and folder is `/`

**Problem:** Custom domain not working
- **Solution:** Verify CNAME file has correct domain, check DNS propagation

### SSL Certificate Issues

**Problem:** "Not Secure" warning
- **Solution:** Wait 24h for GitHub SSL provisioning, ensure "Enforce HTTPS" is checked

**Problem:** Mixed content errors
- **Solution:** Ensure all resources (images, scripts) use HTTPS, not HTTP

### Performance Issues

**Problem:** Slow loading
- **Solution:** 
  - Optimize images (see ASSET_SETUP.md)
  - Enable Cloudflare caching
  - Purge Cloudflare cache
  - Check total page size (<2MB recommended)

### DNS Not Propagating

**Problem:** Domain still shows old content or errors
- **Solution:**
  - Clear browser cache (Ctrl+Shift+R)
  - Wait longer (up to 24-48 hours)
  - Check nameservers are updated at registrar
  - Use [dnschecker.org](https://dnschecker.org/) to monitor

### Cloudflare Errors

**Problem:** Error 521 or 522
- **Solution:** 
  - Set SSL/TLS mode to "Full" (not Full Strict)
  - Verify GitHub Pages is online
  - Wait a few minutes and retry

## 📊 Post-Deployment Checklist

- [ ] Site loads at custom domain (if applicable)
- [ ] HTTPS is enforced
- [ ] All assets display correctly
- [ ] Mobile responsive verified
- [ ] Performance score >85 on PageSpeed
- [ ] Social media previews work
- [ ] SEO meta tags present
- [ ] Analytics configured (if desired)
- [ ] Discord link updated in JS
- [ ] Contact form tested
- [ ] All pages/sections load
- [ ] No broken links
- [ ] Cloudflare caching configured

## 🎓 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Cloudflare DNS Setup](https://developers.cloudflare.com/dns/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebAIM Accessibility Checker](https://wave.webaim.org/)

## 🆘 Need Help?

If deployment issues persist:

1. Check GitHub Pages build logs (repo → Actions tab)
2. Verify DNS with `nslookup necrux.gg`
3. Check browser console for errors (F12)
4. Review Cloudflare Analytics for insights
5. Contact support:
   - GitHub Pages: [GitHub Community](https://github.community/)
   - Cloudflare: [Cloudflare Community](https://community.cloudflare.com/)

---

**Congratulations! Your Necrux Guild website is now live! 🎉**

Next steps:
- Share on social media
- Update Discord with website link
- Monitor analytics
- Keep content fresh with match updates
