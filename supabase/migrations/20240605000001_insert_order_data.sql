INSERT INTO public.orders (
  id, user_id, customer_id, status, total_amount, event_date, event_for_name, 
  package_info, preview_slots, options, created_at, updated_at
)
VALUES 
  (
    uuid_generate_v4(), '149f601d-5af4-49bc-846e-788b836846c1', 'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6', 'pending', 249.99, 
    (now() + interval '7 days')::timestamp, 'Sarah''s Birthday',
    jsonb_build_object(
      'id', 'pkg1',
      'name', 'Birthday Package',
      'price', 249.99,
      'signCount', 3,
      'setupDaysBefore', 1,
      'teardownDaysAfter', 1,
      'extraDayBeforePrice', 25,
      'extraDayAfterPrice', 25,
      'isActive', true,
      'createdAt', (now())::text
    ),
    jsonb_build_array(
      jsonb_build_object(
        'id', 1,
        'sign', jsonb_build_object(
          'id', 'sign1',
          'serialNumber', 'SN001',
          'name', 'Happy Birthday',
          'eventType', 'birthday',
          'colors', jsonb_build_array('#FF5733', '#33FF57'),
          'style', 'playful',
          'theme', 'Balloon',
          'imageUrl', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80',
          'dimensions', jsonb_build_object(
            'width', 24,
            'height', 36,
            'unit', 'inches'
          ),
          'materials', jsonb_build_array('Plastic', 'Metal'),
          'weight', jsonb_build_object(
            'value', 5,
            'unit', 'lbs'
          ),
          'inventory', jsonb_build_object(
            'totalQuantity', 10,
            'quantityAvailable', 8,
            'allocations', jsonb_build_array()
          ),
          'isActive', true,
          'createdAt', (now())::text,
          'updatedAt', (now())::text
        ),
        'isNameSlot', false
      ),
      jsonb_build_object(
        'id', 2,
        'sign', jsonb_build_object(
          'id', 'sign2',
          'serialNumber', 'SN002',
          'name', 'Celebration',
          'eventType', 'birthday',
          'colors', jsonb_build_array('#3357FF'),
          'style', 'modern',
          'theme', 'Stars',
          'imageUrl', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80',
          'dimensions', jsonb_build_object(
            'width', 18,
            'height', 24,
            'unit', 'inches'
          ),
          'materials', jsonb_build_array('Wood'),
          'weight', jsonb_build_object(
            'value', 3,
            'unit', 'lbs'
          ),
          'inventory', jsonb_build_object(
            'totalQuantity', 15,
            'quantityAvailable', 12,
            'allocations', jsonb_build_array()
          ),
          'isActive', true,
          'createdAt', (now())::text,
          'updatedAt', (now())::text
        ),
        'isNameSlot', false
      ),
      jsonb_build_object(
        'id', 3,
        'sign', null,
        'isNameSlot', true
      )
    ),
    jsonb_build_object('earlyDelivery', false, 'latePickup', false),
    now(), now()
  ),
  (
    uuid_generate_v4(), '166490bb-4120-404f-b674-8b1fe452f369', 'b2c3d4e5-f6a7-48b9-c0d1-e2f3a4b5c6d7', 'processing', 349.99, 
    (now() + interval '14 days')::timestamp, 'Mike''s Graduation',
    jsonb_build_object(
      'id', 'pkg2',
      'name', 'Graduation Package',
      'price', 349.99,
      'signCount', 4,
      'setupDaysBefore', 2,
      'teardownDaysAfter', 1,
      'extraDayBeforePrice', 30,
      'extraDayAfterPrice', 30,
      'isActive', true,
      'createdAt', (now())::text
    ),
    jsonb_build_array(
      jsonb_build_object(
        'id', 1,
        'sign', jsonb_build_object(
          'id', 'sign3',
          'serialNumber', 'SN003',
          'name', 'Congrats Grad',
          'eventType', 'graduation',
          'colors', jsonb_build_array('#000000', '#FFD700'),
          'style', 'elegant',
          'theme', 'Academic',
          'imageUrl', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80',
          'dimensions', jsonb_build_object(
            'width', 36,
            'height', 24,
            'unit', 'inches'
          ),
          'materials', jsonb_build_array('Plastic', 'Cardboard'),
          'weight', jsonb_build_object(
            'value', 4,
            'unit', 'lbs'
          ),
          'inventory', jsonb_build_object(
            'totalQuantity', 8,
            'quantityAvailable', 5,
            'allocations', jsonb_build_array()
          ),
          'isActive', true,
          'createdAt', (now())::text,
          'updatedAt', (now())::text
        ),
        'isNameSlot', false
      ),
      jsonb_build_object(
        'id', 2,
        'sign', null,
        'isNameSlot', true
      )
    ),
    jsonb_build_object('earlyDelivery', true, 'latePickup', false),
    now(), now()
  ),
  (
    uuid_generate_v4(), '97e322b1-0028-4acb-ad14-e81069a6772d', 'c3d4e5f6-a7b8-49c0-d1e2-f3a4b5c6d7e8', 'deployed', 499.99, 
    (now() - interval '3 days')::timestamp, 'Tom & Lisa''s Wedding',
    jsonb_build_object(
      'id', 'pkg3',
      'name', 'Wedding Package',
      'price', 499.99,
      'signCount', 5,
      'setupDaysBefore', 1,
      'teardownDaysAfter', 1,
      'extraDayBeforePrice', 40,
      'extraDayAfterPrice', 40,
      'isActive', true,
      'createdAt', (now())::text
    ),
    jsonb_build_array(
      jsonb_build_object(
        'id', 1,
        'sign', jsonb_build_object(
          'id', 'sign4',
          'serialNumber', 'SN004',
          'name', 'Just Married',
          'eventType', 'wedding',
          'colors', jsonb_build_array('#FFFFFF', '#C0C0C0'),
          'style', 'elegant',
          'theme', 'Hearts',
          'imageUrl', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80',
          'dimensions', jsonb_build_object(
            'width', 48,
            'height', 36,
            'unit', 'inches'
          ),
          'materials', jsonb_build_array('Wood', 'Metal'),
          'weight', jsonb_build_object(
            'value', 8,
            'unit', 'lbs'
          ),
          'inventory', jsonb_build_object(
            'totalQuantity', 5,
            'quantityAvailable', 3,
            'allocations', jsonb_build_array()
          ),
          'isActive', true,
          'createdAt', (now())::text,
          'updatedAt', (now())::text
        ),
        'isNameSlot', false
      ),
      jsonb_build_object(
        'id', 2,
        'sign', jsonb_build_object(
          'id', 'sign5',
          'serialNumber', 'SN005',
          'name', 'Forever & Always',
          'eventType', 'wedding',
          'colors', jsonb_build_array('#FFC0CB'),
          'style', 'romantic',
          'theme', 'Floral',
          'imageUrl', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80',
          'dimensions', jsonb_build_object(
            'width', 24,
            'height', 36,
            'unit', 'inches'
          ),
          'materials', jsonb_build_array('Wood'),
          'weight', jsonb_build_object(
            'value', 6,
            'unit', 'lbs'
          ),
          'inventory', jsonb_build_object(
            'totalQuantity', 7,
            'quantityAvailable', 4,
            'allocations', jsonb_build_array()
          ),
          'isActive', true,
          'createdAt', (now())::text,
          'updatedAt', (now())::text
        ),
        'isNameSlot', false
      ),
      jsonb_build_object(
        'id', 3,
        'sign', null,
        'isNameSlot', true
      )
    ),
    jsonb_build_object('earlyDelivery', false, 'latePickup', true),
    now(), now()
  );