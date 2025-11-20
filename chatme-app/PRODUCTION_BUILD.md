# Production Build Guide

This guide will help you build production-ready APK/AAB files for Android and IPA files for iOS.

## Android Production Build

### Step 1: Generate a Production Keystore

**IMPORTANT**: Keep this keystore file safe! You'll need it for all future updates.

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore chatme-release.keystore -alias chatme-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted to enter:
- **Keystore password**: (choose a strong password)
- **Key password**: (can be same as keystore password)
- **Name, Organization, etc.**: (fill in your details)

**Save these credentials securely!** You'll need them for every release.

### Step 2: Configure Gradle for Release Signing

Create a file `android/gradle.properties` (or add to existing) with:

```properties
CHATME_RELEASE_STORE_FILE=chatme-release.keystore
CHATME_RELEASE_KEY_ALIAS=chatme-key-alias
CHATME_RELEASE_STORE_PASSWORD=your_keystore_password
CHATME_RELEASE_KEY_PASSWORD=your_key_password
```

**⚠️ Security Note**: Add `gradle.properties` to `.gitignore` to avoid committing passwords!

### Step 3: Update build.gradle

The build.gradle is already configured to use these properties. Make sure the release signing config is set up correctly.

### Step 4: Build Production APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

### Step 5: Build Production AAB (for Google Play Store)

```bash
cd android
./gradlew bundleRelease
```

The AAB will be generated at:
`android/app/build/outputs/bundle/release/app-release.aab`

## iOS Production Build

### Prerequisites
- Apple Developer Account ($99/year)
- Xcode installed
- Valid provisioning profiles

### Step 1: Configure in Xcode

1. Open `ios/ChatMe.xcworkspace` in Xcode
2. Select your project in the navigator
3. Go to **Signing & Capabilities**
4. Select your **Team** (Apple Developer account)
5. Ensure **Automatically manage signing** is checked

### Step 2: Update Version and Build Number

In Xcode:
- Select your project → General tab
- Update **Version** (e.g., 1.0.0)
- Update **Build** number (e.g., 1)

### Step 3: Build for App Store

**Option A: Using Xcode (Recommended)**
1. Select **Any iOS Device** or **Generic iOS Device** as target
2. Product → Archive
3. Once archived, click **Distribute App**
4. Choose **App Store Connect**
5. Follow the wizard to upload

**Option B: Using Command Line**

```bash
cd ios
xcodebuild -workspace ChatMe.xcworkspace \
  -scheme ChatMe \
  -configuration Release \
  -archivePath build/ChatMe.xcarchive \
  archive

# Then export for App Store
xcodebuild -exportArchive \
  -archivePath build/ChatMe.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist
```

## Quick Build Scripts

I've added these scripts to your `package.json`:

- `npm run build:android:apk` - Build Android APK
- `npm run build:android:aab` - Build Android AAB (for Play Store)
- `npm run build:android:clean` - Clean Android build

## Testing Production Builds

### Android
1. Install the APK on a device: `adb install android/app/build/outputs/apk/release/app-release.apk`
2. Test all features thoroughly
3. Check performance and memory usage

### iOS
1. Install via TestFlight (recommended) or direct install
2. Test on multiple devices
3. Verify all features work correctly

## Before Releasing

- [ ] Test on multiple devices
- [ ] Test on different Android/iOS versions
- [ ] Verify all features work
- [ ] Check app icon displays correctly
- [ ] Test WebSocket connections
- [ ] Verify theme switching works
- [ ] Test image uploads
- [ ] Check memory usage
- [ ] Review app permissions
- [ ] Update version numbers
- [ ] Prepare app store listings
- [ ] Take screenshots for stores
- [ ] Write app description

## Troubleshooting

### Android Build Fails
- Clean build: `cd android && ./gradlew clean`
- Check keystore path and passwords
- Verify `gradle.properties` is configured correctly

### iOS Build Fails
- Clean build folder in Xcode: Product → Clean Build Folder
- Update pods: `cd ios && pod install`
- Check signing certificates in Xcode

### APK/AAB Too Large
- Enable ProGuard (already configured, just set `enableProguardInReleaseBuilds = true`)
- Remove unused assets
- Use Android App Bundle (AAB) instead of APK

## Next Steps

1. **Google Play Store**: Upload AAB file, fill in store listing, submit for review
2. **Apple App Store**: Upload via Xcode or App Store Connect, submit for review

Good luck with your release! 🚀

