INSERT INTO public.customers (id, user_id, name, email, phone, event_address, created_at, updated_at)
VALUES 
  ('a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6', '149f601d-5af4-49bc-846e-788b836846c1', 'John Doe', 'john@example.com', '5551234567', 
   '{"street": "123 Main St", "city": "Austin", "state": "TX", "zip": "78701"}', 
   now(), now()),
  ('b2c3d4e5-f6a7-48b9-c0d1-e2f3a4b5c6d7', '166490bb-4120-404f-b674-8b1fe452f369', 'Jane Smith', 'jane@example.com', '5559876543', 
   '{"street": "456 Oak Ave", "city": "Dallas", "state": "TX", "zip": "75201"}', 
   now(), now()),
  ('c3d4e5f6-a7b8-49c0-d1e2-f3a4b5c6d7e8', '97e322b1-0028-4acb-ad14-e81069a6772d', 'Robert Johnson', 'robert@example.com', '5552468101', 
   '{"street": "789 Pine Blvd", "city": "Houston", "state": "TX", "zip": "77002"}', 
   now(), now());