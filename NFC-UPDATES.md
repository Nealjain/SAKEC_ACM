# NFC Profile Updates

## Changes Made

### 1. Session-Based Preloader
The preloader now shows **only once per browser session** instead of every time you visit an NFC profile.

**How it works:**
- First visit: Shows "Welcome to SAKEC ACM" preloader (2 seconds)
- Subsequent visits in same session: Loads profile directly
- New session (close browser/new tab): Shows preloader again

**Technical Implementation:**
- Uses `sessionStorage.setItem('nfc_preloader_shown', 'true')`
- Checks on page load: `sessionStorage.getItem('nfc_preloader_shown')`
- Clears when browser session ends

### 2. Main Site Navigation
Added multiple ways to navigate to the main website:

**Top Right Button:**
- Floating "Main Site" button in hero section
- Semi-transparent with backdrop blur
- Always visible at top of page

**Sidebar Button:**
- "Visit Main Site" button in left sidebar
- Blue accent color to stand out
- Below "View Full Profile" button

### 3. Simplified Preloader
- Removed: NFC icon, scanning waves, progress bar, loading text
- Kept: Clean "Welcome to SAKEC ACM" message
- Duration: 2 seconds
- Smooth fade in/out animations

## User Experience Flow

### First Visit (New Session)
1. Scan NFC card → Opens URL
2. See "Welcome to SAKEC ACM" (2 seconds)
3. Profile loads automatically
4. Can navigate to main site or full profile

### Subsequent Visits (Same Session)
1. Scan NFC card → Opens URL
2. Profile loads immediately (no preloader)
3. Can navigate to main site or full profile

### New Session
1. Close browser or open new tab
2. Scan NFC card → Opens URL
3. See preloader again (fresh session)

## Testing

### Test Preloader Behavior
1. Visit: `http://localhost:3000/nfc_id/283006fb-63d7-40bf-bf62-e3751c767499`
2. See preloader (first time)
3. Navigate away and come back
4. No preloader (same session)
5. Close browser and reopen
6. See preloader again (new session)

### Test Navigation
1. Click "Main Site" button in top right
2. Or click "Visit Main Site" in sidebar
3. Both should navigate to homepage

## Benefits

### Performance
- Faster loading on repeat visits
- Better user experience for multiple scans
- Reduced animation overhead

### User Experience
- Not repetitive or annoying
- Quick access to main site
- Clear navigation options
- Professional feel

### Technical
- Uses browser's sessionStorage API
- No server-side storage needed
- Automatic cleanup on session end
- Works across all modern browsers

## Browser Compatibility

sessionStorage is supported in:
- Chrome/Edge: All versions
- Firefox: All versions
- Safari: All versions
- Mobile browsers: All modern versions

## Future Enhancements

Possible additions:
- [ ] Remember preference across sessions (localStorage)
- [ ] Skip preloader option
- [ ] Custom preloader per member
- [ ] Analytics tracking for NFC scans
- [ ] Share profile button
- [ ] Download contact card (vCard)

## Notes

- sessionStorage clears when tab/browser closes
- localStorage would persist across sessions
- Current implementation balances UX and branding
- Preloader still shows for first-time visitors
