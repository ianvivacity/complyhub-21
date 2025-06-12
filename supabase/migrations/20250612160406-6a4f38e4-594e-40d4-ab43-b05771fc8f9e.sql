
-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Members can view organisation members" ON public.organisation_members;
DROP POLICY IF EXISTS "Admins can delete organisation members" ON public.organisation_members;
DROP POLICY IF EXISTS "Admins can update organisation members" ON public.organisation_members;

-- Create a security definer function to get user's organisation and role
CREATE OR REPLACE FUNCTION public.get_user_organisation_and_role()
RETURNS TABLE(organisation_id uuid, role text)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT om.organisation_id, om.role::text
  FROM public.organisation_members om
  WHERE om.id = auth.uid()
  LIMIT 1;
$$;

-- Create new policies using the security definer function
CREATE POLICY "Members can view organisation members" 
ON public.organisation_members 
FOR SELECT 
USING (
  organisation_id = (SELECT (public.get_user_organisation_and_role()).organisation_id)
);

-- Allow admins to delete members from their organisation
CREATE POLICY "Admins can delete organisation members" 
ON public.organisation_members 
FOR DELETE 
USING (
  organisation_id = (SELECT (public.get_user_organisation_and_role()).organisation_id)
  AND (SELECT (public.get_user_organisation_and_role()).role) = 'admin'
);

-- Allow admins to update member roles in their organisation
CREATE POLICY "Admins can update organisation members" 
ON public.organisation_members 
FOR UPDATE 
USING (
  organisation_id = (SELECT (public.get_user_organisation_and_role()).organisation_id)
  AND (SELECT (public.get_user_organisation_and_role()).role) = 'admin'
);
