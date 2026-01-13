# 🎨 Asset Setup Guide - Necrux Guild

This guide will help you add all necessary images and assets to complete your website.

## 📋 Required Assets Checklist

### 1. Logo Files (Priority: HIGH)

**Location:** `assets/images/`

- [ ] **logo-full.png** - Main hero logo
  - Recommended size: 2400x800px or wider
  - Max file size: 150KB (optimize with TinyPNG)
  - Format: PNG with transparency
  - Usage: Hero section, main branding

- [ ] **logo-icon.png** - Square icon/favicon
  - Recommended size: 512x512px
  - Max file size: 60KB
  - Format: PNG with transparency
  - Usage: Favicon, social media icons

- [ ] **logo-optimized.png** - General use logo
  - Recommended size: 1200x400px
  - Max file size: 100KB
  - Format: PNG with transparency
  - Usage: Navigation, footer, general branding

### 2. Favicon Files (Priority: MEDIUM)

**Location:** `assets/images/`

Generate from your logo-icon.png using [Favicon Generator](https://realfavicongenerator.net/):

- [ ] **favicon.ico** - Classic favicon (16x16, 32x32)
- [ ] **favicon-16x16.png**
- [ ] **favicon-32x32.png**
- [ ] **apple-touch-icon.png** - iOS/Apple devices (180x180px)

### 3. Player Images (Priority: HIGH)

**Location:** `assets/images/players/`

For each player (Strahd, JinxedMyPants, etc.):

- [ ] **strahd.jpg** - Strahd's profile image
- [ ] **jinxedmypants.jpg** - JinxedMyPants's profile image
- [ ] Add more as needed...

**Specifications:**
- Size: 400x400px (square)
- Max file size: 60KB each
- Format: JPG or WebP
- Content: Player photo, in-game character, or custom artwork

**Currently using:** `placeholder.jpg` (replace with actual images)

### 4. Open Graph Image (Priority: MEDIUM)

**Location:** `assets/images/`

- [ ] **og-image.jpg** - Social media preview image
  - Size: 1200x630px
  - Max file size: 200KB
  - Format: JPG
  - Content: Guild logo + tagline or key visual
  - Usage: Facebook, Twitter, Discord link previews

### 5. Hero Background (Priority: LOW - Optional)

**Location:** `assets/images/`

Choose ONE:

- [ ] **hero-bg.webp** - Static background image
  - Size: 1920x1080px
  - Max file size: 400KB
  - Format: WebP with JPG fallback

OR

- [ ] **hero-loop.mp4** - Animated background video
  - Duration: 5-10 seconds (looping)
  - Size: 1920x1080px
  - Max file size: 3MB
  - Format: MP4, H.264 codec, no audio

**Currently using:** Canvas particle animation (no image needed)

### 6. Sponsor Logos (Priority: LOW)

**Location:** `assets/images/sponsors/`

For each sponsor:

- [ ] **sponsor-1.png**
- [ ] **sponsor-2.png**
- [ ] etc.

**Specifications:**
- Size: 300x100px (flexible)
- Max file size: 50KB each
- Format: PNG or SVG
- Background: Transparent

**Currently using:** Placeholder text

## 🛠️ Image Optimization Tools

### Online Tools (Free)
- **[TinyPNG](https://tinypng.com/)** - Best for PNG compression
- **[Squoosh](https://squoosh.app/)** - Google's image optimizer
- **[Favicon Generator](https://realfavicongenerator.net/)** - Creates all favicon files
- **[Cloudinary](https://cloudinary.com/)** - Batch optimization

### Desktop Tools
- **GIMP** (Free) - Editing and optimization
- **Adobe Photoshop** (Paid) - Professional editing
- **ImageOptim** (Mac) - Drag-and-drop optimization
- **FileOptimizer** (Windows) - Batch optimization

## 📝 Image Naming Convention

- Use lowercase
- Use hyphens, not spaces or underscores
- Be descriptive
- Include size if multiple versions exist

Examples:
```
✅ logo-full.png
✅ player-strahd.jpg
✅ sponsor-brand-name.png

❌ Logo Full.png
❌ player_strahd.JPG
❌ image1.png
```

## 🎯 Quick Start Steps

### Step 1: Prepare Your Logo
1. Have your PNG logo ready
2. Create 3 versions (full, icon, optimized) using the specs above
3. Optimize with TinyPNG
4. Place in `assets/images/`

### Step 2: Generate Favicons
1. Go to [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Upload your logo-icon.png
3. Download and extract files
4. Place in `assets/images/`

### Step 3: Add Player Images
1. Collect player photos or create custom graphics
2. Resize to 400x400px (use [Squoosh](https://squoosh.app/))
3. Optimize to <60KB
4. Rename: `strahd.jpg`, `jinxedmypants.jpg`, etc.
5. Place in `assets/images/players/`

### Step 4: Create Open Graph Image
1. Design a 1200x630px image with your logo + tagline
2. Use Canva, Photoshop, or GIMP
3. Optimize to <200KB
4. Save as `og-image.jpg` in `assets/images/`

### Step 5: Test the Site
1. Open `index.html` in your browser
2. Check that logo appears in hero
3. Verify favicons in browser tab
4. Test social sharing preview

## 🔄 Updating Images Later

### To Replace Logo:
1. Optimize new PNG with same dimensions
2. Overwrite `logo-full.png` in `assets/images/`
3. Clear browser cache (Ctrl+Shift+R)
4. Purge Cloudflare cache if deployed

### To Add New Players:
1. Add image to `assets/images/players/`
2. Edit `index.html` around line 180
3. Copy a player card `<div>` and modify:
   ```html
   <div class="player-card" data-role="jungle">
       <div class="player-image">
           <img src="assets/images/players/newplayer.jpg" alt="Player Name" />
           <div class="player-overlay">
               <span class="player-role">Jungle</span>
           </div>
       </div>
       <div class="player-info">
           <h3 class="player-name">New Player</h3>
           <p class="player-specialty">Your specialty</p>
           <div class="player-champions">
               <span class="champion-tag">Champion 1</span>
               <span class="champion-tag">Champion 2</span>
           </div>
       </div>
   </div>
   ```

## ⚡ Performance Tips

- **Use WebP format** when possible (20-30% smaller than JPG/PNG)
- **Provide fallbacks** for older browsers
- **Lazy load images** below the fold (already implemented)
- **Serve responsive images** using srcset (for future optimization)
- **Test file sizes** - aim for total page weight <2MB

## 🔍 Testing Checklist

After adding images:

- [ ] Logo displays correctly on all screen sizes
- [ ] Favicon appears in browser tab
- [ ] Player images load without errors
- [ ] Social media preview looks good (test with [metatags.io](https://metatags.io/))
- [ ] Images are optimized (<100KB each)
- [ ] No broken image links (check browser console)
- [ ] Mobile performance is good (use Chrome DevTools)

## 💡 Pro Tips

1. **Keep originals**: Save uncompressed versions elsewhere
2. **Use SVG for logos** when possible (infinitely scalable)
3. **Test on real devices**: Emulators don't show true performance
4. **Monitor file sizes**: Use Chrome DevTools Network tab
5. **Consider CDN**: For faster global delivery (Cloudflare already provides this)

## 🆘 Need Help?

- Can't optimize images? Use [Squoosh](https://squoosh.app/) - drag and drop, download
- Logo not showing? Check file path and spelling (case-sensitive on servers)
- Images too large? Reduce dimensions first, then compress
- Need design help? Use [Canva](https://canva.com/) templates (free)

---

**Next Step:** Once you've added images, test locally, then push to GitHub for deployment!
