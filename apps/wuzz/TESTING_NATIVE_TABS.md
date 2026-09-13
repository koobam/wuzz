# 🧪 Testing Guide for Native Tabs in Fossa

## ✅ Installation Complete!

The `react-native-native-tabs` library has been successfully installed in your Fossa project!

### What Was Done

1. ✅ Installed library: `yarn add file:../react-native-native-tabs`
2. ✅ Installed iOS pods: `pod install`
3. ✅ Created test screen: `src/pages/(bottom)/test-native-tabs.tsx`
4. ✅ Added to navigation routes
5. ✅ Updated profile button to navigate to test
6. ✅ Building the app...

---

## 🎯 How to Test

### Step 1: Launch the App

The app is currently building. Once it launches:

1. Navigate to the **Profile tab** (bottom navigation)
2. Tap the **"Test Native Tabs"** button
3. You'll see the native tabs test screen

### Step 2: Test Features

#### **Header Collapse/Reveal**
- ✅ Scroll down → Header collapses smoothly
- ✅ Scroll up → Header reveals smoothly
- ✅ Should be 60 FPS with no lag

#### **Tab Switching**
- ✅ Swipe left/right to switch tabs
- ✅ Tap tab buttons at top
- ✅ Watch the animated indicator move
- ✅ Should be instant with no delay

#### **List Scrolling**
- ✅ Scroll through 100+ items
- ✅ Should maintain 60 FPS
- ✅ Cell reuse should be seamless
- ✅ No jank or stuttering

#### **Item Press**
- ✅ Tap any list item
- ✅ Alert should show with item details
- ✅ Check console for event logs

#### **Pull to Refresh**
- ✅ Pull down on any tab
- ✅ Refresh indicator should appear
- ✅ Check console for refresh event

#### **Infinite Scroll**
- ✅ Scroll to bottom of list
- ✅ Check console for "Load more" event
- ✅ Should trigger before reaching absolute bottom

#### **Scroll to Top FAB**
- ✅ Tap the floating action button (↑)
- ✅ Should scroll smoothly to top
- ✅ Should work on active tab

### Step 3: Check Console Logs

Open React Native debugger and watch for:

```
📱 Tab changed: { index: 1, name: 'media' }
👆 Item pressed: { tab: 0, index: 5, title: 'Post Item 6' }
🔄 Refresh tab: 0
✅ Refresh complete
📊 Load more for tab: 0
⬆️ Scrolling to top
```

---

## 🎨 What You're Seeing

### Header Section (Top 340px)
- Purple gradient background
- Avatar placeholder
- "Native Tabs Test" title
- Stats: 60 FPS, Native, ∞ Scroll
- Collapses on scroll down

### Tab Bar
- Three tabs: Posts (100 items), Media (75 items), Liked (50 items)
- Animated indicator under active tab
- Syncs with swipe gestures

### List Content
- Each item shows title and subtitle
- Tap to show alert with details
- Pull down to refresh
- Scroll to bottom triggers load more

### UI Elements
- Floating ↑ button (bottom right) - scrolls to top
- Info bar (bottom) - shows active tab and "Native Performance ⚡️"

---

## 📊 Performance Testing

### Compare with JS Version

To really see the difference, try this:

1. **Test Native Version** (this screen)
   - Scroll through 100 items
   - Notice: Smooth 60 FPS
   - Switch tabs: Instant
   
2. **Test JS Version** (your current user-detail screen)
   - Same operations
   - Compare: May see frame drops
   - Tab switch: May have delay

### Performance Metrics to Watch

- **FPS**: Should be constant 60 FPS during scroll
- **Memory**: Check Xcode memory graph (~10-30 MB)
- **CPU**: Should be low during scroll
- **Touch Response**: Should be instant

---

## 🐛 Troubleshooting

### If Build Fails

```bash
cd ios
xcodebuild clean
pod deintegrate
pod install
cd ..
yarn ios
```

### If Library Not Found

```bash
# Re-install library
yarn remove react-native-native-tabs
yarn add file:../react-native-native-tabs
cd ios && pod install && cd ..
yarn ios
```

### If Screen Doesn't Show

Check:
1. Navigation added to routes? ✅
2. Type added to RootStackParamList? ✅
3. Profile button navigates correctly? ✅

### If Performance Issues

- Check it's running in Release mode for best performance
- Debug mode may have some overhead
- Test on real device for accurate results

---

## 🎯 Next Steps After Testing

### If Everything Works:

1. **Replace user-detail Screen**
   - Open `src/pages/(user)/user-detail/index.tsx`
   - Replace `react-native-collapsible-tab-view` with `NativeTabView`
   - See: `INTEGRATION_FOSSA.md` in the library folder

2. **Customize the Design**
   - Match your theme colors
   - Adjust header height
   - Customize list items

3. **Add Real Data**
   - Replace mock data with API calls
   - Implement real refresh logic
   - Add pagination

### If You Find Issues:

1. Check console for errors
2. Verify Swift files are included in build
3. Check library documentation
4. File an issue if needed

---

## 📝 Test Checklist

- [ ] App launches successfully
- [ ] Can navigate to test screen
- [ ] Header collapses smoothly
- [ ] Header reveals on scroll up
- [ ] Can switch tabs by swiping
- [ ] Can switch tabs by tapping
- [ ] Indicator animates smoothly
- [ ] List scrolls at 60 FPS
- [ ] Item press shows alert
- [ ] Console logs events
- [ ] Pull to refresh works
- [ ] Infinite scroll triggers
- [ ] Scroll to top FAB works
- [ ] No crashes or errors
- [ ] Performance feels native

---

## 🎉 Success Indicators

If you see:
- ✅ **Smooth 60 FPS** scrolling - SUCCESS!
- ✅ **Instant tab switching** - SUCCESS!
- ✅ **Collapsing header** - SUCCESS!
- ✅ **Console event logs** - SUCCESS!
- ✅ **No crashes** - SUCCESS!

**You're ready to integrate into your real screens!**

---

## 📚 Reference Files

- Test Screen: `src/pages/(bottom)/test-native-tabs.tsx`
- Library Docs: `../react-native-native-tabs/README.md`
- Integration Guide: `../react-native-native-tabs/INTEGRATION_FOSSA.md`
- Quick Start: `../react-native-native-tabs/QUICKSTART.md`

---

## 💡 Pro Tips

1. **Test on Real Device**: Simulator may not show true performance
2. **Check Memory**: Use Xcode Instruments to profile
3. **Compare Side-by-Side**: Test native vs JS version back to back
4. **Watch Console**: All events are logged for debugging

---

**Happy Testing! 🚀**

If everything works, you've successfully integrated a high-performance native tab view!

