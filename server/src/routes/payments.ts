import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  authorizePayment,
  capturePayment,
  refundPayment,
  fetchPayments
} from '../services/paymentService';
import { createNotification } from '../services/notificationService';
import { authorizeClient, authorizePerformer } from '../middlewares/roles';

const router = Router({ mergeParams: true });
router.use(authenticate);

// GET /v1/orders/:orderId/payments - list transactions
router.get('/', authenticate, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const payments = await fetchPayments(orderId);
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});

// POST /v1/orders/:orderId/payments/authorize
router.post('/authorize', authenticate, authorizeClient, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { amount, currency, provider } = req.body;
  if (!amount || !provider) return res.status(400).json({ message: 'Amount and provider required' });
  try {
    const payment = await authorizePayment(orderId, amount, currency || 'USD', provider);
    // Notify client
    await createNotification(req.user!.id, 'payment', `Сума ${amount} ${currency} заморожена`, orderId);
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to authorize payment' });
  }
});

// POST /v1/orders/:orderId/payments/:paymentId/capture
router.post('/:paymentId/capture', authenticate, authorizePerformer, async (req: Request, res: Response) => {
  const { orderId, paymentId } = req.params;
  try {
    const payment = await capturePayment(paymentId);
    // Notify performer
    await createNotification(req.user!.id, 'payment', `Сума ${payment.amount} ${payment.currency} списана`, orderId);
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to capture payment' });
  }
});

// POST /v1/orders/:orderId/payments/:paymentId/refund
router.post('/:paymentId/refund', authenticate, async (req: Request, res: Response) => {
  const { orderId, paymentId } = req.params;
  // only client or admin can refund
  if (req.user!.role !== 'client' && req.user!.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const payment = await refundPayment(paymentId);
    // Notify both
    await createNotification(req.user!.id, 'payment', `Сума ${payment.amount} ${payment.currency} повернена`, orderId);
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to refund payment' });
  }
});

export default router;
