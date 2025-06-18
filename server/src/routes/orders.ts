import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { createNotification } from '../services/notificationService';
import { query } from '../db';
import { authorizeClient, authorizePerformer } from '../middlewares/roles';
import { getWebSocketService } from '../services/webSocketService';

const router = Router();

// All order routes require auth
router.use(authenticate);

// GET /v1/orders - fetch orders for authenticated user
// Query param role determines whether client or performer
// GET /v1/orders - fetch orders with optional filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, search } = req.query as { status?: string; search?: string };
    const where: string[] = [];
    const params: unknown[] = [userId];
    let idx = 2;
    // base condition: client or performer
    where.push(`(o.client_id = $1 OR o.performer_id = $1)`);
    // status filter
    if (status && status !== 'all') {
      where.push(`o.status = $${idx}`);
      params.push(status);
      idx++;
    }
    // search filter
    if (search) {
      where.push(`(COALESCE(s.title, o.title) ILIKE $${idx} OR COALESCE(s.description, o.requirements) ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }
    const sql = `SELECT o.id,
                    o.service_id,
                    COALESCE(s.title, o.title) as title,
                    COALESCE(s.description, o.requirements) as description,
                    o.status,
                    o.price,
                    o.currency,
                    o.deadline,
                    o.created_at AS "createdAt",
                    u1.id AS client_id,
                    u1.name AS client_name,
                    u1.avatar_url AS client_avatar,
                    u1.rating AS client_rating,
                    u2.id AS performer_id,
                    u2.name AS performer_name,
                    u2.avatar_url AS performer_avatar,
                    u2.rating AS performer_rating,
                    COALESCE(sc.id, oc.id) AS category_id,
                    COALESCE(sc.name, oc.name) AS category_name,
                    COALESCE(sc.slug, oc.slug) AS category_slug,
                    0 AS "unreadMessages",
                    '[]'::json AS history,
                    COALESCE(o.additional_options, '{}'::jsonb) AS "additionalOptions",
                    NULL AS rating,
                    NULL AS dispute,
                    (SELECT COALESCE(json_agg(json_build_object(
                        'id', id,
                        'fileUrl', file_url,
                        'fileName', file_name
                      )), '[]')
                     FROM order_attachments att WHERE att.order_id = o.id) AS files
             FROM orders o
             JOIN users u1 ON o.client_id = u1.id
             LEFT JOIN users u2 ON o.performer_id = u2.id
             LEFT JOIN services s ON o.service_id = s.id
             LEFT JOIN service_categories sc ON s.category_id = sc.id
             LEFT JOIN service_categories oc ON o.category_id = oc.id
             WHERE ${where.join(' AND ')}
             ORDER BY o.created_at DESC`;
    const result = await query(sql, params);
    const orders = result.rows.map(r => ({
      id: r.id,
      service_id: r.service_id,
      title: r.title,
      description: r.description,
      status: r.status,
      price: Number(r.price),
      currency: r.currency,
      deadline: r.deadline,
      createdAt: r.createdAt,
      client: { id: r.client_id, name: r.client_name, avatar: r.client_avatar, rating: Number(r.client_rating) },
      performer: r.performer_id ? { id: r.performer_id, name: r.performer_name, avatar: r.performer_avatar, rating: Number(r.performer_rating) } : null,
      category: { id: r.category_id, name: r.category_name, slug: r.category_slug },
      unreadMessages: Number(r.unreadMessages),
      history: r.history,
      additionalOptions: r.additionalOptions,
      rating: r.rating !== null ? Number(r.rating) : undefined,
      dispute: r.dispute,
      files: r.files
    }));
    res.json(orders);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    console.error(error);
    res.status(500).json({ message });
  }
});

// GET /v1/orders/:id - fetch single order by id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await query(
      `SELECT o.id,
              o.service_id,
              COALESCE(s.title, o.title) as title,
              COALESCE(s.description, o.requirements) as description,
              o.status,
              o.price,
              o.currency,
              o.deadline,
              o.created_at AS "createdAt",
              u1.id AS client_id,
              u1.name AS client_name,
              u1.avatar_url AS client_avatar,
              u1.rating AS client_rating,
              u2.id AS performer_id,
              u2.name AS performer_name,
              u2.avatar_url AS performer_avatar,
              u2.rating AS performer_rating,
              COALESCE(sc.id, oc.id) AS category_id,
              COALESCE(sc.name, oc.name) AS category_name,
              COALESCE(sc.slug, oc.slug) AS category_slug,
              0 AS "unreadMessages",
              (SELECT COALESCE(json_agg(json_build_object('status', status, 'changedAt', changed_at, 'by', changed_by)), '[]')
               FROM order_status_history h WHERE h.order_id = o.id) AS history,
              (SELECT COALESCE(json_agg(json_build_object('id', id, 'fileUrl', file_url, 'fileName', file_name)), '[]')
               FROM order_attachments att WHERE att.order_id = o.id) AS files,
              COALESCE(o.additional_options, '{}'::jsonb) AS "additionalOptions"
       FROM orders o
       JOIN users u1 ON o.client_id = u1.id
       LEFT JOIN users u2 ON o.performer_id = u2.id
       LEFT JOIN services s ON o.service_id = s.id
       LEFT JOIN service_categories sc ON s.category_id = sc.id
       LEFT JOIN service_categories oc ON o.category_id = oc.id
       WHERE o.id = $1 AND (o.client_id = $2 OR o.performer_id = $2 OR o.performer_id IS NULL)`
      , [id, req.user!.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
    const r = result.rows[0];
    res.json({
      id: r.id,
      service_id: r.service_id,
      title: r.title,
      description: r.description,
      status: r.status,
      price: Number(r.price),
      currency: r.currency,
      deadline: r.deadline,
      createdAt: r.createdAt,
      client: { id: r.client_id, name: r.client_name, avatar: r.client_avatar, rating: Number(r.client_rating) },
      performer: r.performer_id ? { id: r.performer_id, name: r.performer_name, avatar: r.performer_avatar, rating: Number(r.performer_rating) } : null,
      category: { id: r.category_id, name: r.category_name, slug: r.category_slug },
      unreadMessages: Number(r.unreadMessages),
      history: r.history,
      files: r.files,
      additionalOptions: r.additionalOptions
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch order';
    console.error(error);
    res.status(500).json({ message });
  }
});

// POST /v1/orders - create new order
router.post('/', authenticate, authorizeClient, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { service_id, title, description, price, currency, deadline, additional_options = {} } = req.body;

    // Basic validation: ensure required fields present (price=0 valid)
    if (typeof title !== 'string' || !title.trim() ||
        typeof description !== 'string' || !description.trim() ||
        !deadline ||
        price == null || isNaN(Number(price))) {
      return res.status(400).json({ message: 'Missing or invalid fields: title, description, price, deadline' });
    }

    const finalServiceId = service_id;
    let finalPerformerId: string | null = null;
    let finalTitle = title;
    const finalDescription = description;

     // Check if this is a service-based order
     if (service_id) {
       // Fetch service details to get performer and title
       const serviceResult = await query(
         'SELECT id, title, performer_id, price FROM services WHERE id = $1 AND is_active = true',
         [service_id]
       );

       if (serviceResult.rowCount === 0) {
         return res.status(404).json({ message: 'Service not found or inactive' });
       }

       const service = serviceResult.rows[0];
       finalPerformerId = service.performer_id;
       finalTitle = service.title;

       // Check if user is not trying to order their own service
       if (service.performer_id === userId) {
         return res.status(400).json({ message: 'Cannot order your own service' });
       }
     } else {
       // This is a custom order - available for performers to bid; performer_id remains null
       finalPerformerId = null;
     }

    // Determine category for grouping (default to 'other' for custom orders)
    let finalCategoryId: string | null = null;
    if (!service_id) {
      const slug = additional_options.category || 'other';
      const catResult = await query(
        'SELECT id FROM service_categories WHERE slug = $1',
        [slug]
      );
      finalCategoryId = catResult.rowCount ? catResult.rows[0].id : null;
    } else {
      const svcCatRes = await query(
        'SELECT category_id FROM services WHERE id = $1',
        [service_id]
      );
      finalCategoryId = svcCatRes.rowCount ? svcCatRes.rows[0].category_id : null;
    }

    // Create the order: map `description` from request to `requirements` column in DB
    const result = await query(
      `INSERT INTO orders(
          service_id, client_id, performer_id, title, requirements,
          status, price, currency, deadline, additional_options, category_id
        ) VALUES(
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11
        ) RETURNING *`,
      [
        finalServiceId,
        userId,
        finalPerformerId,
        finalTitle,
        description,
        finalPerformerId ? 'pending' : 'open',
        price,
        currency || 'USD',
        deadline,
        JSON.stringify(additional_options || {}),
        finalCategoryId
      ]
    );

    const order = result.rows[0];

    // Send notification to performer if assigned
    if (finalPerformerId) {
      await createNotification(
        finalPerformerId,
        'new_order',
        `Нове замовлення "${order.title}"`,
        order.id
      );
    }

    res.status(201).json(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    console.error('Create order error:', error);
    res.status(500).json({ message });
  }
});

// PATCH /v1/orders/:id - update order fields
router.patch('/:id', authenticate, authorizePerformer, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  for (const key of ['title','description','status','price','currency','deadline','additional_options','rating','dispute']) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(req.body[key]);
      idx++;
    }
  }
  if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
  values.push(id);
  const sql = `UPDATE orders SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  try {
    const result = await query(sql, values);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
    const updated = result.rows[0];
    // Якщо змінено статус, зберігаємо в історії
    if (req.body.status) {
      await query(
        `INSERT INTO order_status_history(order_id, status, changed_by) VALUES($1, $2, $3)`,
        [id, req.body.status, userId]
      );
      // notify other party про зміну статусу
      const otherUser = updated.client_id === userId ? updated.performer_id : updated.client_id;
      await createNotification(
        otherUser,
        'status_change',
        `Статус замовлення "${updated.title}" змінено на ${req.body.status}`,
        id
      );

      // Broadcast status update via WebSocket
      const webSocketService = getWebSocketService();
      if (webSocketService) {
        webSocketService.broadcastOrderStatusUpdate(id, req.body.status, userId);
      }
    }
    // Якщо додано additional_options
    if (req.body.additional_options) {
      const otherUser2 = updated.client_id === userId ? updated.performer_id : updated.client_id;
      await createNotification(
        otherUser2,
        'message',
        `Додаткові опції до замовлення "${updated.title}" оновлено`,
        id
      );
    }
    res.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update order';
    console.error(error);
    res.status(500).json({ message });
  }
});

// DELETE /v1/orders/:id - delete order
router.delete('/:id', authenticate, authorizeClient, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await query(`DELETE FROM orders WHERE id = $1`, [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
    res.status(204).send();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete order';
    console.error(error);
    res.status(500).json({ message });
  }
});

// POST /v1/orders/:id/attachments - add file to order
router.post('/:id/attachments', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fileUrl, fileName } = req.body;
  if (!fileUrl || !fileName) {
    return res.status(400).json({ message: 'Missing fileUrl or fileName' });
  }
  try {
    const result = await query(
      `INSERT INTO order_attachments(order_id, file_url, file_name, file_size, file_type, uploaded_by)
       VALUES($1,$2,$3,0,'', $4) RETURNING id, file_url AS "fileUrl", file_name AS "fileName"`,
      [id, fileUrl, fileName, req.user!.id]
    );
    const attachment = result.rows[0];
    // notify other party про новий файл
    // спочатку отримати order для клієнта і виконавця
    const ord = await query(`SELECT client_id, performer_id, title FROM orders WHERE id = $1`, [id]);
    if (ord.rowCount) {
      const { client_id, performer_id, title } = ord.rows[0];
      const recipient = client_id === req.user!.id ? performer_id : client_id;
      await createNotification(
        recipient,
        'message',
        `Додано файл до замовлення "${title}"`,
        id
      );
    }
    res.status(201).json(attachment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add attachment' });
  }
});

export default router;
