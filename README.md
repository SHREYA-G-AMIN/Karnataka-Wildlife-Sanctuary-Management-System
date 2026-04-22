# 🌿 Karnataka Wildlife Sanctuary Management System

## Description
A full-stack web application to manage and monitor wildlife data across Karnataka national parks. It includes animals, species, health records, forest officers, and poaching activities. The project focuses on real-world database design, API integration, and dynamic frontend rendering.

## Features
- Authentication with email notification on login
- Dashboard with dynamic park data (animals, species, endangered, poaching)
- Animals page with filtering
- Species gallery with images (DB-driven, no dummy data)
- **Interactive Species Gallery**
  - Users can click on any species card to view detailed information in a popup/modal
  - **Species Details Included:**
    - Description
    - Habitat (Karnataka-specific)
    - Conservation Status
    - Fun Facts ("Did You Know?" section)
  - **UI Enhancement:**
    - Smooth modal popup with improved user interaction
    - Makes the application more engaging and informative
- Officers management
- Health records tracking
- Poaching incidents tracking

## Tech Stack
### Frontend
- React (Vite)
- CSS
- React Router

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Other
- Nodemailer
- dotenv

## Covered National Parks
This system includes data for the following national parks:

- Bandipur National Park
- Nagarhole National Park
- Bannerghatta National Park
- Kudremukh National Park
- Kali (Anshi) National Park

These parks were selected to represent diverse ecosystems across Karnataka, including forests, grasslands, and biodiversity hotspots.

## Project Structure
```
wildlife-project/
│
├── frontend/        # React (Vite)
├── backend/         # Node + Express
├── database/        # SQL schema and data
└── README.md
```

## Database Tables
- `Sanctuary`
- `Species`
- `Animals`
- `Health_Records`
- `Forest_Officers`
- `Poaching_Incidents`
- `Conservation_Programs`
- `Parks`

## API Endpoints
- `POST /login`
- `GET /parks`
- `GET /animals`
- `GET /species`
- `GET /officers`
- `GET /health`
- `GET /poaching`

## Setup Instructions
### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
```bash
PORT=5000
EMAIL_USER=[your_email@gmail.com](mailto:your_email@gmail.com)
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

## Highlights
- Full-stack implementation
- Real-world structured data
- Proper relational database design
- Clean UI

## Learning Outcomes
- Full-stack development
- API integration
- Database design
- Debugging

## Author
Shreya G Amin

## License
This project is developed as part of a DBMS (Database Management Systems) academic project and demonstrates full-stack application development with a focus on database design and integration.
