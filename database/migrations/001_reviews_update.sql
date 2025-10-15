-- Migration to update the reviews table and add rating calculation functions

-- Step 1: Alter the reviews table to support two-way reviews
-- Drop the existing unique constraint on order_id
ALTER TABLE reviews DROP CONSTRAINT reviews_order_id_key;

-- Add a reviewer_id column to identify who left the review
ALTER TABLE reviews ADD COLUMN reviewer_id UUID REFERENCES users(id);

-- Add a review_type column to distinguish between client and performer reviews
ALTER TABLE reviews ADD COLUMN review_type VARCHAR(50) CHECK (review_type IN ('client_to_performer', 'performer_to_client'));

-- Add a unique constraint to ensure one review per user per order
ALTER TABLE reviews ADD CONSTRAINT unique_review_per_user_order UNIQUE (order_id, reviewer_id);

-- Step 2: Create a function to update user and service ratings
CREATE OR REPLACE FUNCTION update_ratings()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating DECIMAL;
  total_reviews INT;
BEGIN
  -- If the review is from a client to a performer
  IF NEW.review_type = 'client_to_performer' THEN
    -- Update the performer's rating
    SELECT AVG(rating), COUNT(rating) INTO avg_rating, total_reviews
    FROM reviews
    WHERE performer_id = NEW.performer_id AND review_type = 'client_to_performer';

    UPDATE users SET rating = avg_rating WHERE id = NEW.performer_id;

    -- Update the service's rating
    UPDATE services SET rating = avg_rating, review_count = total_reviews
    WHERE id = (SELECT service_id FROM orders WHERE id = NEW.order_id);

  -- If the review is from a performer to a client
  ELSIF NEW.review_type = 'performer_to_client' THEN
    -- Update the client's rating
    SELECT AVG(rating) INTO avg_rating
    FROM reviews
    WHERE client_id = NEW.client_id AND review_type = 'performer_to_client';

    UPDATE users SET rating = avg_rating WHERE id = NEW.client_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create a trigger to call the update_ratings function
CREATE TRIGGER trigger_update_ratings
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_ratings();