-- Allow deletion of subscribers (for admin usage)
-- Note: In a real production app with auth, you'd restrict this to admin role.
-- Since we are using a simple setup, we will enable delete for now.

CREATE POLICY "Enable delete for users" ON "public"."newsletter_subscribers"
AS PERMISSIVE FOR DELETE
TO public
USING (true);
