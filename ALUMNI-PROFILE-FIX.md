# Alumni Profile View Fix

## Issue
The "View Profile" button on alumni member cards was not working because of a route parameter mismatch.

## Root Cause
- The folder was named `app/team/alumni/[id]/`
- But the code expected `params.slug` instead of `params.id`
- The alumni card component was correctly linking to `/team/alumni/${slug}`

## Solution
Renamed the folder from `[id]` to `[slug]` to match the expected parameter:
```
app/team/alumni/[id]/ → app/team/alumni/[slug]/
```

## Files Affected
- `app/team/alumni/[slug]/page.tsx` - Uses `params.slug`
- `app/team/alumni/[slug]/client.tsx` - Uses `params.slug`
- `components/alumni-member-card.tsx` - Links to `/team/alumni/${slug}`

## How It Works Now
1. Alumni card generates a slug from the member's name using `slugify(member.name)`
2. Links to `/team/alumni/${slug}`
3. The page receives `params.slug` and matches it correctly
4. Client component fetches the alumni member by matching the slug

## Testing
Visit any alumni profile by clicking "View Profile" on an alumni card at `/team/alumni`
