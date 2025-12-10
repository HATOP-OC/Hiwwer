import { Router, Request, Response } from 'express';
import { query } from '../db';
import { authenticate } from '../middlewares/auth';
import { uploadServiceImages } from '../middlewares/upload';
import path from 'path';

// Extend Request interface locally
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      name: string;
      role: 'client' | 'performer' | 'admin';
      avatar?: string;
      bio?: string;
      rating?: number;
      telegramId?: string;
      createdAt: Date;
    };
  }
}

const router = Router();

// Функція для генерації slug з назви
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Видаляємо спецсимволи
    .replace(/[\s_-]+/g, '-') // Замінюємо пробіли на дефіси
    .replace(/^-+|-+$/g, ''); // Видаляємо дефіси на початку і в кінці
}

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
    
    // Fetch images for each service
    const serviceIds = result.rows.map(r => r.id);
    const imagesResult = serviceIds.length > 0 
      ? await query(`SELECT service_id, image_url FROM service_images WHERE service_id = ANY($1::uuid[]) ORDER BY created_at`, [serviceIds])
      : { rows: [] };
    
    // Group images by service_id
    const imagesByService: Record<string, string[]> = {};
    for (const img of (imagesResult.rows as any[])) {
      const sid = img.service_id as string;
      if (!imagesByService[sid]) imagesByService[sid] = [];
      imagesByService[sid].push(img.image_url as string);
    }
    
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
      images: imagesByService[r.id] || [],
      tags: [] as Array<{ id: string; name: string }>
    }));
    res.json({ services });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch services';
    console.error(error);
    res.status(500).json({ message });
  }
});

// GET /v1/services/categories - отримати всі категорії послуг
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        sc.id, 
        sc.name, 
        sc.slug, 
        sc.description,
        COUNT(s.id) as service_count
      FROM service_categories sc
      LEFT JOIN services s ON s.category_id = sc.id
      GROUP BY sc.id, sc.name, sc.slug, sc.description
      ORDER BY sc.name
    `);

    const categories = result.rows.map(r => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      service_count: parseInt(r.service_count)
    }));

    res.json({ categories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
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
    
    // Перевірка чи це UUID чи slug категорії
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(id)) {
      // Якщо це не UUID, то це slug категорії - повертаємо послуги з цієї категорії
      const { page = '1', limit = '10' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const result = await query(
        `SELECT s.id, s.title, s.description, s.price, s.currency, s.delivery_time, s.rating, s.review_count,
        u.id as performer_id, u.name as performer_name, u.avatar_url as performer_avatar,
        c.id as category_id, c.name as category_name, c.slug as category_slug
        FROM services s
        JOIN users u ON s.performer_id = u.id
        JOIN service_categories c ON s.category_id = c.id
        WHERE c.slug = $1
        ORDER BY s.created_at DESC LIMIT $2 OFFSET $3`,
        [id, limit, offset]
      );
      
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
      
      return res.json({ services });
    }
    
    // Якщо це UUID - шукаємо конкретну послугу
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
    
    // Fetch images for the service
    const imagesResult = await query(
      `SELECT image_url FROM service_images WHERE service_id = $1 ORDER BY created_at`,
      [id]
    );
    const images = imagesResult.rows.map(img => img.image_url);
    
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
      images: images
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch service';
    console.error(error);
    res.status(500).json({ message });
  }
});

// POST /v1/services - створити нову послугу (тільки для performer'ів)
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Перевірка чи користувач є performer'ом
    const userResult = await query('SELECT is_performer FROM users WHERE id = $1', [userId]);
    if (userResult.rowCount === 0 || !userResult.rows[0].is_performer) {
      return res.status(403).json({ message: 'Only performers can create services' });
    }

    const { title, description, price, currency, delivery_time, category_id, tags } = req.body;

    // Валідація
    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!description?.trim()) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!category_id) {
      return res.status(400).json({ message: 'Category is required' });
    }
    if (!price || price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }
    if (!delivery_time || delivery_time <= 0) {
      return res.status(400).json({ message: 'Delivery time must be greater than 0' });
    }

    // Створення послуги
    const result = await query(`
      INSERT INTO services (title, description, price, currency, delivery_time, category_id, performer_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, description, price, currency, delivery_time, created_at
    `, [title.trim(), description.trim(), price, currency || 'USD', delivery_time, category_id, userId]);

    const service = result.rows[0];

    // Додавання тегів, якщо є
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags.slice(0, 10)) { // Максимум 10 тегів
        if (typeof tagName === 'string' && tagName.trim()) {
          const cleanTagName = tagName.trim();
          const tagSlug = generateSlug(cleanTagName);
          
          // Спочатку перевіряємо, чи існує тег з такою назвою
          const existingTag = await query(`SELECT id FROM tags WHERE name = $1`, [cleanTagName]);
          
          if (existingTag.rows.length > 0) {
            // Тег вже існує, використовуємо його
            const tagId = existingTag.rows[0].id;
            await query(`
              INSERT INTO service_tags (service_id, tag_id)
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING
            `, [service.id, tagId]);
          } else {
            // Створюємо новий тег
            const tagResult = await query(`
              INSERT INTO tags (name, slug) VALUES ($1, $2)
              RETURNING id
            `, [cleanTagName, tagSlug]);
            
            const tagId = tagResult.rows[0].id;
            
            await query(`
              INSERT INTO service_tags (service_id, tag_id)
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING
            `, [service.id, tagId]);
          }
        }
      }
    }

    res.status(201).json({ 
      message: 'Service created successfully',
      service: {
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        currency: service.currency,
        delivery_time: service.delivery_time,
        created_at: service.created_at
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create service';
    console.error(error);
    res.status(500).json({ message });
  }
});

// PUT /v1/services/:id - оновити послугу (тільки власник)
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const serviceId = req.params.id;
    const { title, description, price, currency, delivery_time, category_id, tags } = req.body;

    // Перевіряємо, чи користувач є власником послуги
    const ownerCheck = await query(`
      SELECT performer_id FROM services WHERE id = $1
    `, [serviceId]);

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (ownerCheck.rows[0].performer_id !== userId) {
      return res.status(403).json({ message: 'You can only edit your own services' });
    }

    // Валідація
    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!description?.trim()) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!category_id) {
      return res.status(400).json({ message: 'Category is required' });
    }
    if (!price || price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }
    if (!delivery_time || delivery_time <= 0) {
      return res.status(400).json({ message: 'Delivery time must be greater than 0' });
    }

    // Оновлення послуги
    const result = await query(`
      UPDATE services 
      SET title = $1, description = $2, price = $3, currency = $4, delivery_time = $5, category_id = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, title, description, price, currency, delivery_time, created_at, updated_at
    `, [title.trim(), description.trim(), price, currency || 'USD', delivery_time, category_id, serviceId]);

    const service = result.rows[0];

    // Видалення старих тегів
    await query(`DELETE FROM service_tags WHERE service_id = $1`, [serviceId]);

    // Додавання нових тегів
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags.slice(0, 10)) {
        if (typeof tagName === 'string' && tagName.trim()) {
          const cleanTagName = tagName.trim();
          const tagSlug = generateSlug(cleanTagName);
          
          // Спочатку перевіряємо, чи існує тег з такою назвою
          const existingTag = await query(`SELECT id FROM tags WHERE name = $1`, [cleanTagName]);
          
          if (existingTag.rows.length > 0) {
            // Тег вже існує, використовуємо його
            const tagId = existingTag.rows[0].id;
            await query(`
              INSERT INTO service_tags (service_id, tag_id)
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING
            `, [serviceId, tagId]);
          } else {
            // Створюємо новий тег
            const tagResult = await query(`
              INSERT INTO tags (name, slug) VALUES ($1, $2)
              RETURNING id
            `, [cleanTagName, tagSlug]);
            
            const tagId = tagResult.rows[0].id;
            
            await query(`
              INSERT INTO service_tags (service_id, tag_id)
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING
            `, [serviceId, tagId]);
          }
        }
      }
    }

    res.json({ 
      message: 'Service updated successfully',
      service: {
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        currency: service.currency,
        delivery_time: service.delivery_time,
        created_at: service.created_at,
        updated_at: service.updated_at
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update service';
    console.error(error);
    res.status(500).json({ message });
  }
});

// DELETE /v1/services/:id - видалити послугу
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Перевірка, чи послуга належить користувачу
    const serviceResult = await query(
      `SELECT id, performer_id FROM services WHERE id = $1`,
      [id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (serviceResult.rows[0].performer_id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this service' });
    }

    // Видалення пов'язаних записів (каскадне видалення)
    await query(`DELETE FROM service_tags WHERE service_id = $1`, [id]);
    await query(`DELETE FROM service_images WHERE service_id = $1`, [id]);
    
    // Видалення самої послуги
    await query(`DELETE FROM services WHERE id = $1`, [id]);

    res.json({ message: 'Service deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete service';
    console.error(error);
    res.status(500).json({ message });
  }
});

// POST /v1/services/:id/images - завантажити зображення для послуги
router.post('/:id/images', authenticate, uploadServiceImages.array('images', 5), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    // Перевірка, що послуга належить поточному користувачу
    const serviceResult = await query(
      `SELECT performer_id FROM services WHERE id = $1`,
      [id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (serviceResult.rows[0].performer_id !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to upload images for this service' });
    }

    // Отримати поточну максимальну позицію
    const positionResult = await query(
      `SELECT COALESCE(MAX(position), -1) as max_position FROM service_images WHERE service_id = $1`,
      [id]
    );
    let currentPosition = positionResult.rows[0].max_position + 1;

    // Зберегти інформацію про зображення в базі даних
    const imageUrls: string[] = [];
    for (const file of files) {
      const imageUrl = `/uploads/services/${file.filename}`;
      
      await query(
        `INSERT INTO service_images (service_id, image_url, position) VALUES ($1, $2, $3)`,
        [id, imageUrl, currentPosition]
      );

      imageUrls.push(imageUrl);
      currentPosition++;
    }

    res.json({ 
      message: 'Images uploaded successfully',
      images: imageUrls
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upload images';
    console.error(error);
    res.status(500).json({ message });
  }
});

// DELETE /v1/services/:serviceId/images/:imageId - видалити зображення послуги
router.delete('/:serviceId/images/:imageId', authenticate, async (req: Request, res: Response) => {
  try {
    const { serviceId, imageId } = req.params;

    // Перевірка, що послуга належить поточному користувачу
    const serviceResult = await query(
      `SELECT performer_id FROM services WHERE id = $1`,
      [serviceId]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (serviceResult.rows[0].performer_id !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to delete images for this service' });
    }

    // Отримати інформацію про зображення
    const imageResult = await query(
      `SELECT image_url FROM service_images WHERE id = $1 AND service_id = $2`,
      [imageId, serviceId]
    );

    if (imageResult.rows.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Видалити зображення з бази даних
    await query(
      `DELETE FROM service_images WHERE id = $1`,
      [imageId]
    );

    res.json({ message: 'Image deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete image';
    console.error(error);
    res.status(500).json({ message });
  }
});

export default router;
