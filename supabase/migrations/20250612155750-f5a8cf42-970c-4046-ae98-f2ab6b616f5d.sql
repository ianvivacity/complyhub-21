
-- Enable Row Level Security on organisation_members table
ALTER TABLE public.organisation_members ENABLE ROW LEVEL SECURITY;

-- Allow members to view other members in their organisation
CREATE POLICY "Members can view organisation members" 
ON public.organisation_members 
FOR SELECT 
USING (
  organisation_id IN (
    SELECT organisation_id 
    FROM public.organisation_members 
    WHERE id = auth.uid()
  )
);

-- Allow admins to delete members from their organisation
CREATE POLICY "Admins can delete organisation members" 
ON public.organisation_members 
FOR DELETE 
USING (
  organisation_id IN (
    SELECT organisation_id 
    FROM public.organisation_members 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to update member roles in their organisation
CREATE POLICY "Admins can update organisation members" 
ON public.organisation_members 
FOR UPDATE 
USING (
  organisation_id IN (
    SELECT organisation_id 
    FROM public.organisation_members 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow inserting new members (for invitations)
CREATE POLICY "Allow inserting new members" 
ON public.organisation_members 
FOR INSERT 
WITH CHECK (true);
