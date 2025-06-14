import { query } from '../db';

/**
 * Placeholder payment provider integration
 * Simulate authorize (freeze), capture, refund
 */
export async function authorizePayment(orderId: string, amount: number, currency: string, provider: string): Promise<unknown> {
  // Simulate provider call, e.g., Stripe: paymentIntent.create({ amount, currency, capture_method: 'manual' })
  const providerPaymentId = `prov_${Date.now()}`;
  // Insert into payments table
  const result = await query(
    `INSERT INTO payments(order_id, amount, currency, status, provider, provider_payment_id)
     VALUES($1,$2,$3,'authorized',$4,$5) RETURNING *`,
    [orderId, amount, currency, provider, providerPaymentId]
  );
  return result.rows[0];
}

export async function capturePayment(paymentId: string): Promise<unknown> {
  // Simulate provider capture
  // Update status to completed
  const result = await query(
    `UPDATE payments SET status = 'completed', updated_at = NOW() WHERE id = $1 RETURNING *`,
    [paymentId]
  );
  return result.rows[0];
}

export async function refundPayment(paymentId: string): Promise<unknown> {
  // Simulate provider refund
  // Update status to refunded
  const result = await query(
    `UPDATE payments SET status = 'refunded', updated_at = NOW() WHERE id = $1 RETURNING *`,
    [paymentId]
  );
  return result.rows[0];
}

export async function fetchPayments(orderId: string): Promise<unknown[]> {
  const result = await query(
    `SELECT id, amount, currency, status, provider, provider_payment_id AS "providerPaymentId", created_at AS "createdAt", updated_at AS "updatedAt"
     FROM payments WHERE order_id = $1 ORDER BY created_at`,
    [orderId]
  );
  return result.rows;
}
