# LIBRIS Logo & Icon System

## 📱 Overview

LIBRIS is a professional, modern app icon for a university library management system. The design features a minimalist geometric 'L' with an integrated bookmark/progress bar element.

**Design Specifications:**
- **Primary Color:** Deep Professional Blue (#254194)
- **Accent Color:** Premium Gold/Yellow (#ffc107)
- **Style:** Flat/Semi-flat, minimalist geometric
- **Shapes:** Rounded square container, clean typography

---

## 🎨 Design Elements

### Logo Components:
1. **Rounded Square Background** - Deep blue gradient (#2a4fa0 to #254194)
2. **Geometric 'L' Shape** - Gold/yellow (#ffc107 to #ffda47)
3. **Bookmark Accent** - Decorative notch symbolizing reading/progress
4. **Progress Lines** - Subtle horizontal lines for depth and flow

---

## 📂 File Locations

- **SVG (Scalable Vector):** `src/assets/libris-logo.svg`
- **React Component:** `src/components/LibrisLogo.tsx`
- **Component Styles:** `src/components/LibrisLogo.css`

---

## 🚀 Usage

### Basic Usage in React:

```tsx
import LibrisLogo from './components/LibrisLogo'

// Default (medium size, no text)
<LibrisLogo />

// With text
<LibrisLogo showText={true} />

// Different sizes
<LibrisLogo size="sm" />    {/* 32px */}
<LibrisLogo size="md" />    {/* 64px - default */}
<LibrisLogo size="lg" />    {/* 96px */}
<LibrisLogo size="xl" />    {/* 128px */}

// Custom size
<LibrisLogo size={256} />

// With custom className
<LibrisLogo className="custom-class" showText={true} />
```

### Integration Points:

#### 1. **Navigation Bar**
```tsx
<LandingNavbar>
  <LibrisLogo size="sm" />
</LandingNavbar>
```

#### 2. **Header/Branding**
```tsx
<header>
  <LibrisLogo size="lg" showText={true} />
</header>
```

#### 3. **Favicon (in index.html)**
```html
<link rel="icon" type="image/svg+xml" href="/src/assets/libris-logo.svg">
```

#### 4. **Loading/Splash Screen**
```tsx
<div className="splash-screen">
  <LibrisLogo size="xl" className="animate" />
</div>
```

---

## 🎯 Size Guide

| Size | Pixels | Best Use |
|------|--------|----------|
| `sm` | 32px | Navbar, breadcrumbs, lists |
| `md` | 64px | Default, card headers |
| `lg` | 96px | Sidebar, feature cards |
| `xl` | 128px | Hero section, splash screens |

---

## 🌈 Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Background | Deep Blue | #254194 |
| Accent Light | Gold | #ffc107 |
| Accent Bright | Light Gold | #ffda47 |
| Border | Dark Blue | #1a2d6e |
| Shadow | Blue with opacity | rgba(37, 65, 148, 0.3) |

---

## 💻 Export for Other Platforms

### For iOS App:
1. Open `libris-logo.svg` in Adobe XR or Figma
2. Export as PNG at 512x512px (regular) and 1024x1024px (retina)
3. Add to Xcode Assets

### For Android App:
1. Export at these sizes:
   - ldpi: 36x36px
   - mdpi: 48x48px
   - hdpi: 72x72px
   - xhdpi: 96x96px
   - xxhdpi: 144x144px

### For Web Favicon:
```bash
# Convert SVG to favicon.ico using a tool like ImageMagick
convert libris-logo.svg -define icon:auto-resize=256,128,96,64,48,32,16 favicon.ico
```

---

## 🎨 Customization

### Changing Colors:
Edit the gradient IDs in `LibrisLogo.tsx`:
```tsx
<stop offset="100%" style={{ stopColor: '#YourColor', stopOpacity: 1 }} />
```

### Adjusting Size:
Modify the `sizeMap` object:
```tsx
const sizeMap = {
  sm: 32,
  md: 64,
  lg: 96,
  xl: 256, // Custom size
}
```

---

## ✨ Features

✅ **Scalable Vector (SVG)** - Perfect for any screen size
✅ **Responsive** - Works on mobile and desktop
✅ **Hover Effects** - Subtle scale and shadow animations
✅ **Dark Mode Support** - Automatically adapts colors
✅ **TypeScript Support** - Full type safety in React
✅ **Accessibility** - Semantic SVG structure
✅ **Performance** - Lightweight, no external dependencies

---

## 📋 Integration Checklist

- [ ] Replace logo in navbar (`LandingNavbar.tsx`)
- [ ] Update favicon in `index.html`
- [ ] Add to dashboard header
- [ ] Use in loading screens
- [ ] Update login page branding
- [ ] Add to hero section
- [ ] Test on mobile devices
- [ ] Test in dark mode

---

## 🔗 Next Steps

1. **Integrate into Navigation:** Update `LandingNavbar.tsx` to use `LibrisLogo`
2. **Update Favicon:** Add SVG to index.html
3. **Export for Mobile:** Generate icon packs for iOS/Android
4. **Brand Guidelines:** Document usage in style guide
5. **Variations:** Create icon variations (outline, filled, animated)

---

**Created:** April 8, 2026
**System:** LIBRIS - University Library Management System
**Version:** 1.0.0
