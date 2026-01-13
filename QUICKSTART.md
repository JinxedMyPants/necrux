# ⚡ Quick Start Guide - Necrux Guild Website

Get your website live in 3 steps! Full details in README.md, ASSET_SETUP.md, and DEPLOYMENT.md.

## 🎯 Step 1: Add Your Logo (5 minutes)

**What you need:** Your Necrux PNG logo file

**Actions:**
1. Optimize your logo at [tinypng.com](https://tinypng.com/)
2. Save as `logo-full.png` in `assets/images/` folder
3. Generate favicons at [realfavicongenerator.net](https://realfavicongenerator.net/)
4. Add favicon files to `assets/images/`

**Test:** Open `index.html` - logo should appear in hero section

## 🚀 Step 2: Deploy to GitHub Pages (10 minutes)

**Actions:**

```bash
# In terminal (PowerShell):
cd c:\NCXDevelopment\Programming\necrux

# Initialize and push to GitHub
git add .
git commit -m "Launch Necrux Guild website"
git push origin main
```

**Enable GitHub Pages:**
- Go to your repo → Settings → Pages
- Source: `main` branch, `/` folder
- Click Save
- Wait 2 minutes, visit: `https://JinxedMyPants.github.io/necrux/`

## 🌐 Step 3: Configure Custom Domain (Optional, 15 minutes)

**If you have necrux.gg or similar:**

**GitHub:**
- Settings → Pages → Custom domain: `necrux.gg`
- Save and wait

**Cloudflare DNS:**
- Add 4 A records to GitHub Pages IPs (see DEPLOYMENT.md)
- Add CNAME for www
- Set to Proxied (orange cloud)
- SSL/TLS mode: Full
- Enable "Always Use HTTPS"

**Done!** Visit your domain in 10-60 minutes.

## 📝 Essential Customizations

### Update Discord Link
Edit `assets/js/main.js` line 464:
```javascript
const DISCORD_INVITE = 'https://discord.gg/YOUR-INVITE';
```

### Add Player Images
1. Place images in `assets/images/players/`
2. Name: `strahd.jpg`, `jinxedmypants.jpg`, etc.
3. Size: 400x400px, <60KB each

### Update Match Schedule
Edit `index.html` around line 260 - modify match cards with real dates/opponents

### Update About Stats
Edit `index.html` around line 150 - change `data-target` values for:
- Tournament Wins
- Active Players  
- Win Rate %

## 🐛 Quick Fixes

**Logo not showing?**
- Check file name: must be `logo-full.png` (lowercase)
- Check location: `assets/images/logo-full.png`

**Animations not working?**
- Check browser console (F12) for errors
- Verify GSAP CDN links in `index.html`

**Site not deploying?**
- Check GitHub Actions tab for build errors
- Verify branch name is `main` (not `master`)

## 📚 Full Documentation

- **README.md** - Complete overview, features, customization
- **ASSET_SETUP.md** - Image requirements, optimization, tools
- **DEPLOYMENT.md** - Detailed GitHub Pages + Cloudflare setup
- **index.html** - Main site structure
- **assets/css/style.css** - All styling
- **assets/js/main.js** - Animations and interactions

## ✅ Launch Checklist

Before going live:

- [ ] Logo added and displays correctly
- [ ] Discord invite link updated in JS
- [ ] Player roster updated with real names/roles
- [ ] Match schedule updated with real dates
- [ ] About section stats customized
- [ ] Contact form tested
- [ ] Site tested on mobile
- [ ] GitHub Pages deployed successfully
- [ ] Custom domain configured (if applicable)
- [ ] SSL/HTTPS working
- [ ] Social media preview looks good

## 🎉 Post-Launch

1. **Share on social media** - announce the new site
2. **Update Discord server** - pin website link
3. **Monitor analytics** - Cloudflare provides free analytics
4. **Keep content fresh** - update schedule, add news/achievements
5. **Collect player images** - gradually replace placeholders

## 🆘 Need Help?

- **Asset questions** → See ASSET_SETUP.md
- **Deployment issues** → See DEPLOYMENT.md
- **Customization** → See README.md
- **Code issues** → Check browser console (F12)

---

**Your website is ready to dominate! Good luck on the rift! 🎮⚔️**
