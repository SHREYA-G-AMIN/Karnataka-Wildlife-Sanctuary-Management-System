CREATE DATABASE wildlife_db;

USE wildlife_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL
);

INSERT INTO users (email, password) VALUES
('shreyagamin@gmail.com', '1234');

CREATE TABLE parks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  location VARCHAR(100) NOT NULL,
  area VARCHAR(50) NOT NULL,
  famous VARCHAR(120) NOT NULL,
  image TEXT NOT NULL,
  animals INT NOT NULL,
  species INT NOT NULL,
  endangered INT NOT NULL,
  poaching INT NOT NULL,
  activity TEXT
);

INSERT INTO parks (name, location, area, famous, image, animals, species, endangered, poaching, activity) VALUES
(
  'Bandipur National Park',
  'Karnataka',
  '874 sq km',
  'Tigers & Elephants',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
  120,
  45,
  10,
  5,
  '[\"Poaching reported in Zone A\",\"Tiger treated for injury\",\"Elephant migration tracked\",\"New species recorded in Zone B\"]'
),
(
  'Nagarhole National Park',
  'Karnataka',
  '643 sq km',
  'Leopards & Deer',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  95,
  38,
  8,
  3,
  '[\"Leopard spotted in Zone C\",\"Forest regeneration program started\",\"Illegal entry detected\"]'
),
(
  'Kudremukh National Park',
  'Karnataka',
  '600 sq km',
  'Grasslands & Wildlife',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
  80,
  35,
  6,
  2,
  '[\"Plantation drive conducted\",\"Rare species sighted\"]'
),
(
  'Bannerghatta National Park',
  'Bangalore',
  '260 sq km',
  'Butterflies & Lions',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
  70,
  30,
  5,
  2,
  '[\"Butterfly park maintenance\",\"Lion enclosure upgraded\"]'
),
(
  'Anshi National Park',
  'Karnataka',
  '340 sq km',
  'Dense Forests',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80',
  60,
  25,
  4,
  1,
  '[\"Tree census completed\",\"Animal tracking ongoing\"]'
);
