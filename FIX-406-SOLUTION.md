# Fix for 406 Not Acceptable Errors

## Root Cause
The `event_registration_forms` table has RLS (Row Level Security) enabled but is missing proper policies that allow public (anon) users to read the data. When the Events page loads, it queries this table for every event, resulting in multiple 406 errors.

## The Problem Flow
1. Events page loads and displays all events
2. For each event, `EventDetailsDialog` component calls `getEventRegistrationForm(event.id)`
3. This queries `event_registration_forms` table with `.single()`
4. RLS blocks the query → 406 Not Acceptable error
5. This happens for EVERY event on the page (30+ events = 30+ errors)

## Solution

### Step 1: Run the Quick Fix SQL
Run this file in Supabase SQL Editor:
```
acm main/supabase/QUICK-FIX-406-ERRORS.sql
```

This will:
- Remove all conflicting/old policies
- Create simple, permissive policies:
  - `allow_all_read_forms` - Anyone can read event_registration_forms
  - `allow_all_read_fields` - Anyone can read event_form_fields  
  - `allow_all_insert_registrations` - Anyone can submit registrations
  - `allow_auth_all_forms` - Authenticated users can manage forms
  - `allow_auth_all_fields` - Authenticated users can manage fields
  - `allow_auth_read_registrations` - Authenticated users can view registrations

### Step 2: Verify the Fix
After running the SQL, check:
1. Open browser console
2. Navigate to Events page
3. Should see NO 406 errors
4. Event registration forms should load properly

### Step 3: Test Registration Flow
1. Click on an event with a registration form
2. Click "Register Now"
3. Fill out and submit the form
4. Should work without errors

## Why This Happens
Supabase RLS is very strict by default. Even though you have table-level permissions (GRANT SELECT), RLS policies act as an additional filter. If no policy explicitly allows a query, it gets blocked with a 406 error.

## Current Status
- ✅ Table permissions: Correct (anon has SELECT on all tables)
- ❌ RLS policies: Missing or too restrictive
- ❌ Result: 406 errors on every event_registration_forms query

## After Fix
- ✅ Table permissions: Correct
- ✅ RLS policies: Permissive for public read, authenticated manage
- ✅ Result: No errors, forms load properly
