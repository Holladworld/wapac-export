-- Reset admin password to a known value
UPDATE admin_users
SET password_hash = 'sha256:6cec823fd73bebe346e983aa6bb4ef4d:71bfc97cd63f0dfde6dd7dec8be9fd80add383966fe9a72548f4a2ef0a4483e6959a4f6445a0dade65a44e6a30726251a5a9f7b8d1d3bcea2f64bfecb7e09907'
WHERE email = 'wapacexport@gmail.com';

-- Update broken product images (thecharcoalfactory.com URLs -> Pexels)
UPDATE products SET image_url = 'https://images.pexels.com/photos/7792528/pexels-photo-7792528.jpeg?auto=compress&cs=tinysrgb&w=900'
WHERE name = 'A-Grade Machine-Made Bamboo Charcoal';

UPDATE products SET image_url = 'https://images.pexels.com/photos/8914490/pexels-photo-8914490.jpeg?auto=compress&cs=tinysrgb&w=900'
WHERE name = 'Shaped Bamboo Charcoal';

UPDATE products SET image_url = 'https://images.pexels.com/photos/7973045/pexels-photo-7973045.jpeg?auto=compress&cs=tinysrgb&w=900'
WHERE name = 'Low Ash Shaped Bamboo Shisha Charcoal';

UPDATE products SET image_url = 'https://images.pexels.com/photos/12568621/pexels-photo-12568621.jpeg?auto=compress&cs=tinysrgb&w=900'
WHERE name = 'Eco-Friendly Shisha Charcoal';

UPDATE products SET image_url = 'https://images.pexels.com/photos/6024/holiday-vacation-summer-garden.jpg?auto=compress&cs=tinysrgb&w=900'
WHERE name = 'A-Grade Low-Ash Shaped Wood Charcoal';

UPDATE products SET image_url = 'https://images.pexels.com/photos/1857726/pexels-photo-1857726.jpeg?auto=compress&cs=tinysrgb&w=900'
WHERE name = 'A-Grade Wood Charcoal for Grilling';

-- Update contact phone to the real number
UPDATE site_settings SET value = '+234 803 046 3210', updated_at = now() WHERE key = 'contact_phone';
