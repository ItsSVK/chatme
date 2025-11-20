# App Icon Setup Guide

✅ **Icons have been successfully generated!** Your app icon is now set up for both Android and iOS.

## Quick Setup (Recommended)

### Step 1: Prepare Your Icon
- Create a **1024x1024px** PNG image with your app icon
- Make sure it has:
  - No transparency (or use a solid background)
  - Square dimensions (1024x1024)
  - High quality
  - Simple, recognizable design (works well at small sizes)

### Step 2: Generate All Icon Sizes

Place your icon image (e.g., `icon.png`) in the project root, then run:

```bash
npx app-icon generate --icon=icon.png
```

This will automatically:
- Generate all Android icon sizes (mipmap folders)
- Generate all iOS icon sizes (AppIcon.appiconset)
- Place them in the correct locations

### Step 3: Rebuild Your App

**Android:**
```bash
npm run android
```

**iOS:**
```bash
cd ios && pod install && cd ..
npm run ios
```

## Manual Setup (Alternative)

If you prefer to set icons manually:

### Android Icons

Replace the icon files in these folders:
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48px)
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72px)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96px)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144px)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192px)

Also replace `ic_launcher_round.png` in each folder if you want rounded icons.

### iOS Icons

Add icon images to:
`ios/ChatMe/Images.xcassets/AppIcon.appiconset/`

Required sizes:
- 20x20@2x (40x40px)
- 20x20@3x (60x60px)
- 29x29@2x (58x58px)
- 29x29@3x (87x87px)
- 40x40@2x (80x80px)
- 40x40@3x (120x120px)
- 60x60@2x (120x120px)
- 60x60@3x (180x180px)
- 1024x1024 (App Store)

## Using Your Existing Logo

If you want to use `src/assets/chatme.png`:

1. Make sure it's 1024x1024px (resize if needed)
2. Copy it to the project root as `icon.png`
3. Run: `npx app-icon generate --icon=icon.png`

## Tips

- **Design**: Keep it simple - icons are displayed at small sizes
- **Colors**: Use vibrant, contrasting colors
- **Shape**: Square icons work best (Android/iOS will apply rounding)
- **Testing**: Always test on actual devices to see how it looks

