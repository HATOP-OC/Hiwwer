import { Router } from 'express';
import { pool } from '../db';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// Get policy by slug (public)
router.get('/policies/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const lang = req.query.lang as string || 'en';
    const result = await pool.query(
      'SELECT id, slug, title, content, content_markdown FROM policies WHERE slug = $1 AND language_code = $2',
      [slug, lang]
    );

    if (result.rows.length === 0) {
      // Try fallback to 'en' if not found
      const fallbackResult = await pool.query(
        'SELECT id, slug, title, content, content_markdown FROM policies WHERE slug = $1 AND language_code = $2',
        [slug, 'en']
      );
      if (fallbackResult.rows.length === 0) {
        return res.status(404).json({ error: 'Policy not found' });
      }
      return res.json(fallbackResult.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all policies (admin only)
router.get('/admin/policies', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, slug, language_code, title, content_markdown, created_at, updated_at FROM policies ORDER BY slug, language_code'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update policy (admin only)
router.post('/admin/policies', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { slug, language_code = 'en', title, content_markdown } = req.body;

    if (!slug || !title || !content_markdown) {
      return res.status(400).json({ error: 'Slug, title, and content_markdown are required' });
    }

    // Convert markdown to HTML (simple conversion, you might want to use a library like marked)
    const content = content_markdown; // For now, just store as is, frontend will handle rendering

    const result = await pool.query(`
      INSERT INTO policies (slug, language_code, title, content, content_markdown)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (slug, language_code)
      DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        content_markdown = EXCLUDED.content_markdown,
        updated_at = NOW()
      RETURNING id, slug, language_code, title, content, content_markdown
    `, [slug, language_code, title, content, content_markdown]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving policy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete policy (admin only)
router.delete('/admin/policies/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM policies WHERE id = $1', [id]);
    res.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    console.error('Error deleting policy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;