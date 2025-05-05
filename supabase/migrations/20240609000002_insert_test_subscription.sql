-- Insert a test subscription for the current user
INSERT INTO subscriptions (id, user_id, status, plan, plan_name, stripe_customer_id, stripe_subscription_id, current_period_start, current_period_end, created_at, updated_at)
VALUES (
  'sub_test123',
  '149f601d-5af4-49bc-846e-788b836846c1',
  'active',
  'pro-plan',
  'Professional',
  'cus_test123',
  'sub_test123',
  NOW(),
  (NOW() + INTERVAL '30 days'),
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
