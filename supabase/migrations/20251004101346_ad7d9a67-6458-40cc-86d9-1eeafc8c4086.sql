-- Add custom domain fields to projects table
ALTER TABLE public.projects
ADD COLUMN custom_domain text,
ADD COLUMN domain_verified boolean DEFAULT false,
ADD COLUMN published_at timestamp with time zone;