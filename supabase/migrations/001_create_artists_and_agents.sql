-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    photo_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create artists table
CREATE TABLE IF NOT EXISTS public.artists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    bio TEXT,
    bio_full TEXT,
    location TEXT,
    label TEXT,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    photo_url TEXT NOT NULL,
    hero_image_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    media JSONB DEFAULT '{}'::jsonb,
    featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_artists_slug ON public.artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_agent_id ON public.artists(agent_id);
CREATE INDEX IF NOT EXISTS idx_artists_featured ON public.artists(featured);
CREATE INDEX IF NOT EXISTS idx_artists_name ON public.artists(name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_agents_updated_at
    BEFORE UPDATE ON public.agents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_artists_updated_at
    BEFORE UPDATE ON public.artists
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view agents" ON public.agents
    FOR SELECT USING (true);

CREATE POLICY "Public can view artists" ON public.artists
    FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to manage data
CREATE POLICY "Authenticated users can insert agents" ON public.agents
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update agents" ON public.agents
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete agents" ON public.agents
    FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert artists" ON public.artists
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update artists" ON public.artists
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete artists" ON public.artists
    FOR DELETE TO authenticated USING (true);

-- Insert sample data for testing
INSERT INTO public.agents (name, email) VALUES
    ('John Smith', 'john@mg-company.com'),
    ('Maria Garcia', 'maria@mg-company.com')
ON CONFLICT (email) DO NOTHING;

-- Comment on tables
COMMENT ON TABLE public.agents IS 'Booking agents representing artists';
COMMENT ON TABLE public.artists IS 'Artists/talent roster represented by MG-Company';
COMMENT ON COLUMN public.artists.social_links IS 'JSON object with keys: instagram, spotify, youtube, soundcloud, apple_music, website, etc.';
COMMENT ON COLUMN public.artists.media IS 'JSON object with keys: audio (array of embed URLs), video (array of embed URLs)';
