import { Router, Request, Response } from 'express';
import { query } from '../db';
import { authenticate } from '../middlewares/auth';

const router = Router();

// GET /v1/services?category=slug&page=1&limit=10
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, page = '1', limit = '10' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    let baseSql = `SELECT s.id, s.title, s.description, s.price, s.currency, s.delivery_time, s.rating, s.review_count,
      u.id as performer_id, u.name as performer_name, u.avatar_url as performer_avatar,
      c.id as category_id, c.name as category_name, c.slug as category_slug
      FROM services s
      JOIN users u ON s.performer_id = u.id
      JOIN service_categories c ON s.category_id = c.id`;
    const params: unknown[] = [];
    if (category) {
      params.push(category);
      baseSql += ` WHERE c.slug = $${params.length}`;
    }
    baseSql += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const result = await query(baseSql, params);
    // Fetch images and tags separately or return minimal
    const services = result.rows.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      price: r.price,
      currency: r.currency,
      delivery_time: r.delivery_time,
      rating: r.rating,
      review_count: r.review_count,
      performer: { id: r.performer_id, name: r.performer_name, avatar_url: r.performer_avatar },
      category: { id: r.category_id, name: r.category_name, slug: r.category_slug },
      images: [] as string[],
      tags: [] as Array<{ id: string; name: string }>
    }));
    res.json({ services });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch services';
    console.error(error);
    res.status(500).json({ message });
  }
});

// GET /v1/services/my - отримати мої послуги (для performer'ів)
router.get('/my', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await query(`
      SELECT s.id, s.title, s.description, s.price, s.currency, s.delivery_time, s.rating, s.review_count, s.created_at,
        u.id as performer_id, u.name as performer_name, u.avatar_url as performer_avatar, u.rating as performer_rating,
        c.id as category_id, c.name as category_name, c.slug as category_slug
      FROM services s
      JOIN users u ON s.performer_id = u.id
      JOIN service_categories c ON s.category_id = c.id
      WHERE s.performer_id = $1
      ORDER BY s.created_at DESC
    `, [userId]);

    const services = result.rows.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      price: r.price,
      currency: r.currency,
      delivery_time: r.delivery_time,
      rating: r.rating,
      review_count: r.review_count,
      created_at: r.created_at,
      performer: { 
        id: r.performer_id, 
        name: r.performer_name, 
        avatar_url: r.performer_avatar,
        rating: r.performer_rating
      },
      category: { id: r.category_id, name: r.category_name, slug: r.category_slug },
      images: [] as string[],
      tags: [] as Array<{ id: string; name: string }>
    }));

    res.json({ services });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch my services';
    console.error(error);
    res.status(500).json({ message });
  }
});

// GET /v1/services/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT s.*, u.id as performer_id, u.name as performer_name, u.avatar_url as performer_avatar, u.bio as performer_bio, u.rating as performer_rating,
      c.id as category_id, c.name as category_name, c.slug as category_slug
      FROM services s
      JOIN users u ON s.performer_id = u.id
      JOIN service_categories c ON s.category_id = c.id
      WHERE s.id = $1`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Service not found' });
    const r = result.rows[0];
    // For brevity, not fetching tags/images
    res.json({
      id: r.id,
      title: r.title,
      description: r.description,
      price: r.price,
      currency: r.currency,
      delivery_time: r.delivery_time,
      rating: r.rating,
      review_count: r.review_count,
      performer: { id: r.performer_id, name: r.performer_name, avatar_url: r.performer_avatar, bio: r.performer_bio, rating: r.performer_rating },
      category: { id: r.category_id, name: r.category_name, slug: r.category_slug },
      tags: [],
      images: []
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch service';
    console.error(error);
    res.status(500).json({ message });
  }
});

export default router;
