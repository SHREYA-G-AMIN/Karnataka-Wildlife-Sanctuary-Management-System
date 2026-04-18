CREATE DATABASE wildlife_db;

USE wildlife_db;

CREATE TABLE Sanctuary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  location VARCHAR(120) NOT NULL,
  area VARCHAR(50) NOT NULL
);

CREATE TABLE Species (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  image_url TEXT
);

CREATE TABLE Animals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  species_id INT NOT NULL,
  sanctuary_id INT NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL,
  health_status VARCHAR(50) NOT NULL,
  FOREIGN KEY (species_id) REFERENCES Species(id),
  FOREIGN KEY (sanctuary_id) REFERENCES Sanctuary(id)
);

CREATE TABLE Plants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  type VARCHAR(80) NOT NULL,
  sanctuary_id INT NOT NULL,
  FOREIGN KEY (sanctuary_id) REFERENCES Sanctuary(id)
);

CREATE TABLE Forest_Officers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  designation VARCHAR(80) NOT NULL,
  experience INT NOT NULL,
  sanctuary_id INT NOT NULL,
  FOREIGN KEY (sanctuary_id) REFERENCES Sanctuary(id)
);

CREATE TABLE Conservation_Programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  start_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  sanctuary_id INT NOT NULL,
  FOREIGN KEY (sanctuary_id) REFERENCES Sanctuary(id)
);

CREATE TABLE Poaching_Incidents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  sanctuary_id INT NOT NULL,
  FOREIGN KEY (sanctuary_id) REFERENCES Sanctuary(id)
);

CREATE TABLE Tourist_Permits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visitor_name VARCHAR(120) NOT NULL,
  date DATE NOT NULL,
  sanctuary_id INT NOT NULL,
  FOREIGN KEY (sanctuary_id) REFERENCES Sanctuary(id)
);

INSERT INTO Sanctuary (id, name, location, area) VALUES
(1, 'Bandipur National Park', 'Karnataka', '874 sq km'),
(2, 'Nagarhole National Park', 'Karnataka', '643 sq km'),
(3, 'Bannerghatta National Park', 'Karnataka', '260 sq km'),
(4, 'Kudremukh National Park', 'Karnataka', '600 sq km'),
(5, 'Kali (Anshi) National Park', 'Karnataka', '340 sq km');

INSERT INTO Species (id, name, category, image_url) VALUES
(1, 'Tiger', 'Mammal', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=900&q=80'),
(2, 'Elephant', 'Mammal', 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=900&q=80'),
(3, 'Leopard', 'Mammal', 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=80'),
(4, 'Sloth Bear', 'Mammal', 'https://images.unsplash.com/photo-1530268729830-8c7f90f3eedf?auto=format&fit=crop&w=900&q=80'),
(5, 'Spotted Deer', 'Mammal', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'),
(6, 'Peacock', 'Bird', 'https://images.unsplash.com/photo-1516834474-48f35e58be8e?auto=format&fit=crop&w=900&q=80'),
(7, 'Python', 'Reptile', 'https://images.unsplash.com/photo-1551974580-7f759bb7e3ef?auto=format&fit=crop&w=900&q=80'),
(8, 'Cobra', 'Reptile', 'https://images.unsplash.com/photo-1501703979959-797917eb21c8?auto=format&fit=crop&w=900&q=80'),
(9, 'Langur', 'Mammal', 'https://images.unsplash.com/photo-1519222970733-f546218fa6d7?auto=format&fit=crop&w=900&q=80'),
(10, 'Wild Boar', 'Mammal', 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=900&q=80');

INSERT INTO Plants (name, type, sanctuary_id) VALUES
('Teak', 'Tree', 1),
('Bamboo', 'Grass', 1),
('Sandalwood', 'Tree', 2),
('Rosewood', 'Tree', 2),
('Neem', 'Tree', 3),
('Eucalyptus', 'Tree', 3),
('Shola Grass', 'Grassland', 4),
('Evergreen Forest Trees', 'Forest', 5);

INSERT INTO Forest_Officers (name, designation, experience, sanctuary_id) VALUES
('Ramesh Kumar', 'Forest Ranger', 12, 1),
('Suresh Gowda', 'Forest Guard', 6, 1),
('Anita Sharma', 'Deputy Conservator', 10, 2),
('Vijay Rao', 'Range Officer', 14, 3),
('Kiran Nayak', 'Forest Guard', 5, 4),
('Meena Das', 'Wildlife Officer', 9, 5);

INSERT INTO Conservation_Programs (name, start_date, status, sanctuary_id) VALUES
('Project Tiger Initiative', '2020-01-01', 'Active', 1),
('Project Elephant Program', '2019-06-15', 'Active', 2),
('Habitat Restoration Drive', '2022-03-10', 'Ongoing', 3),
('Biodiversity Monitoring Program', '2021-09-01', 'Active', 4),
('Anti-Poaching Task Force', '2023-01-01', 'Active', 5);

INSERT INTO Poaching_Incidents (date, description, sanctuary_id) VALUES
('2024-01-12', 'Snare trap found during patrol', 1),
('2024-02-05', 'Illegal hunting attempt prevented', 2),
('2024-03-08', 'Suspicious movement detected in buffer zone', 3),
('2024-03-18', 'Forest patrol seized illegal weapons', 4),
('2024-04-02', 'Poachers apprehended by task force', 5);

INSERT INTO Tourist_Permits (visitor_name, date, sanctuary_id) VALUES
('Rahul Sharma', '2024-04-10', 1),
('Sneha Reddy', '2024-04-11', 2),
('Amit Verma', '2024-04-12', 3),
('Priya Nair', '2024-04-13', 4),
('Karan Mehta', '2024-04-14', 5);

INSERT INTO Animals (name, species_id, sanctuary_id, age, gender, health_status) VALUES

-- Bandipur (sanctuary_id = 1)
('TGR-BND-001', 1, 1, 6, 'Male', 'Healthy'),
('TGR-BND-002', 1, 1, 5, 'Female', 'Healthy'),
('ELP-BND-001', 2, 1, 12, 'Female', 'Healthy'),
('ELP-BND-002', 2, 1, 10, 'Male', 'Healthy'),
('DER-BND-001', 5, 1, 4, 'Female', 'Healthy'),
('BER-BND-001', 4, 1, 7, 'Male', 'Healthy'),

-- Nagarhole (sanctuary_id = 2)
('LEO-NAG-001', 3, 2, 5, 'Male', 'Injured'),
('LEO-NAG-002', 3, 2, 6, 'Female', 'Healthy'),
('ELP-NAG-001', 2, 2, 14, 'Male', 'Healthy'),
('DER-NAG-001', 5, 2, 3, 'Female', 'Healthy'),
('BOR-NAG-001', 10, 2, 5, 'Male', 'Healthy'),

-- Bannerghatta (sanctuary_id = 3)
('PEA-BAN-001', 6, 3, 3, 'Male', 'Healthy'),
('LAN-BAN-001', 9, 3, 6, 'Female', 'Healthy'),
('BOR-BAN-001', 10, 3, 4, 'Male', 'Healthy'),

-- Kudremukh (sanctuary_id = 4)
('PYT-KUD-001', 7, 4, 8, 'Female', 'Healthy'),
('COB-KUD-001', 8, 4, 2, 'Male', 'Healthy'),
('DER-KUD-001', 5, 4, 5, 'Female', 'Healthy'),

-- Anshi (sanctuary_id = 5)
('COB-ANS-001', 8, 5, 3, 'Male', 'Healthy'),
('LAN-ANS-001', 9, 5, 7, 'Female', 'Healthy'),
('BER-ANS-001', 4, 5, 6, 'Male', 'Healthy');


CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL
);

INSERT INTO users (email, password) VALUES
('shreyagamin@gmail.com', '1234');

CREATE TABLE parks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sanctuary_id INT NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  location VARCHAR(100) NOT NULL,
  area VARCHAR(50) NOT NULL,
  famous VARCHAR(120) NOT NULL,
  image TEXT NOT NULL,
  animals INT NOT NULL,
  species INT NOT NULL,
  endangered INT NOT NULL,
  poaching INT NOT NULL,
  activity TEXT,
  FOREIGN KEY (sanctuary_id) REFERENCES Sanctuary(id)
);

INSERT INTO parks (sanctuary_id, name, location, area, famous, image, animals, species, endangered, poaching, activity) VALUES
(
  1,
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
  2,
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
  4,
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
  3,
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
  5,
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

UPDATE Conservation_Programs
SET name = 'Project Tiger', start_date = '1973-04-01'
WHERE id = 1;

UPDATE Conservation_Programs
SET name = 'Project Elephant', start_date = '1992-02-01'
WHERE id = 2;

UPDATE Conservation_Programs
SET name = 'Habitat Restoration Program', start_date = '2021-06-01'
WHERE id = 3;

UPDATE Conservation_Programs
SET name = 'Biodiversity Monitoring Initiative', start_date = '2020-01-01'
WHERE id = 4;

UPDATE Conservation_Programs
SET name = 'Anti-Poaching Initiative', start_date = '2022-01-01'
WHERE id = 5;
