-- Add policies table for Terms of Service, Privacy Policy, etc.
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) NOT NULL,
    language_code VARCHAR(10) NOT NULL DEFAULT 'en',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(slug, language_code)
);

CREATE INDEX idx_policies_slug ON policies(slug);
CREATE INDEX idx_policies_language ON policies(language_code);