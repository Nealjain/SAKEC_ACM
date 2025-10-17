# NFC Profile Card Setup

## Overview
The NFC profile card feature allows members to share their profile via NFC cards. When someone scans the NFC card, they'll see a beautiful preloader followed by the member's profile.

## URL Format
```
http://localhost:3000/nfc_id/{member-id}
```

Example:
```
http://localhost:3000/nfc_id/283006fb-63d7-40bf-bf62-e3751c767499
```

## Features

### 1. Custom Preloader
- **Welcome Animation**: Shows "Welcome to SAKEC ACM" with animated text
- **NFC Icon**: Animated NFC card icon with scanning waves
- **Progress Bar**: Smooth loading progress indicator
- **Duration**: 2 seconds before showing profile

### 2. Profile Display
- **Member Photo**: Full profile image
- **Basic Info**: Name, position, PRN, year, department
- **Social Links**: LinkedIn, GitHub, Email
- **Personal Quote**: If available
- **About Section**: Member bio
- **Skills**: List of technical skills (if available)
- **Achievements**: List of accomplishments (if available)
- **Contact Button**: Direct email link
- **View Full Profile**: Link to complete team profile page

### 3. Design
- **Dark Theme**: Black background with blue accents
- **Responsive**: Works on all device sizes
- **SAKEC ACM Branding**: Prominent branding at top
- **NFC Badge**: Shows "NFC Profile Card" badge

## How to Set Up NFC Cards

### Step 1: Get Member ID
1. Go to Supabase Dashboard
2. Open `team_members` table
3. Find the member and copy their `id` (UUID)

### Step 2: Program NFC Card
1. Use an NFC writing app (like NFC Tools for Android/iOS)
2. Create a new record
3. Add a URL/URI record
4. Enter: `https://yourdomain.com/nfc_id/{member-id}`
5. Write to the NFC card

### Step 3: Test
1. Scan the NFC card with a phone
2. Should open the URL in browser
3. See the preloader animation
4. View the member profile

## NFC Card Recommendations

### Hardware
- **NTAG215/216**: Best compatibility
- **Size**: Credit card size (85.6mm × 54mm)
- **Material**: PVC or metal cards

### Apps for Programming
- **Android**: NFC Tools, TagWriter
- **iOS**: NFC Tools, Simply NFC

## URL Configuration

### Development
```
http://localhost:3000/nfc_id/{id}
```

### Production
```
https://sakec-acm.com/nfc_id/{id}
```

## Customization

### Change Preloader Duration
Edit `components/nfc-preloader.tsx`:
```typescript
const duration = 2000 // Change to desired milliseconds
```

### Change Branding Text
Edit `components/nfc-preloader.tsx`:
```typescript
<h2>SAKEC ACM</h2> // Change to your text
```

### Change Colors
The preloader uses blue theme. To change:
- `text-blue-400` → `text-{color}-400`
- `from-blue-400` → `from-{color}-400`

## Testing Different Members

### Example URLs
```
# Neal Jain
http://localhost:3000/nfc_id/283006fb-63d7-40bf-bf62-e3751c767499

# Another member (replace with actual ID)
http://localhost:3000/nfc_id/your-member-id-here
```

## Troubleshooting

### Profile Not Found
- Check if member ID exists in database
- Verify URL is correct
- Check member has `is_published = true` (if applicable)

### Preloader Not Showing
- Check if framer-motion is installed: `npm list framer-motion`
- Clear browser cache
- Check browser console for errors

### Images Not Loading
- Verify `image_url` in database
- Check image path is correct
- Ensure images are in `/public` folder

### Social Links Not Working
- Verify URLs in database include `https://`
- Check `linkedin_url`, `github_url`, `email` fields

## Database Fields Used

### Required
- `id`: Member UUID
- `name`: Member name
- `position`: Role/position

### Optional
- `image_url`: Profile photo
- `PRN`: Student PRN number
- `year`: Academic year
- `department`: Department name
- `personal_quote`: Personal quote
- `about_us`: Bio/description
- `skills`: Array of skills
- `achievements`: Array of achievements
- `linkedin_url`: LinkedIn profile
- `github_url`: GitHub profile
- `email`: Email address

## Security Notes

1. **Public Access**: NFC URLs are publicly accessible
2. **No Authentication**: Anyone with the URL can view the profile
3. **Privacy**: Only include information members are comfortable sharing publicly
4. **Rate Limiting**: Consider adding rate limiting in production

## Future Enhancements

- [ ] QR code generation for each profile
- [ ] Analytics tracking for NFC scans
- [ ] Custom themes per member
- [ ] Download vCard option
- [ ] Share profile button
- [ ] View count display
- [ ] Recent activity feed

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Verify database connection
4. Check member ID is correct
