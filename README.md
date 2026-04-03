# 🗺️ PIN Code Explorer

A production-level full-stack web application to explore, search, and analyze India's postal PIN code data.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS        |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB Atlas                       |
| Charts    | Recharts                            |

## Project Structure

```
sy/
├── backend/
│   ├── server.js              # Express entry point
│   ├── config/db.js           # MongoDB connection
│   ├── models/Pincode.js      # Mongoose schema
│   ├── routes/pincodeRoutes.js
│   ├── controllers/pincodeController.js
│   ├── utils/importCSV.js     # CSV import script
│   └── .env                   # MONGO_URI, PORT
│
└── frontend/
    ├── src/
    │   ├── components/        # Navbar, FilterPanel, DataTable, etc.
    │   ├── pages/             # Dashboard, Explore, PincodeDetail, About
    │   ├── services/api.js    # Axios API layer
    │   ├── App.jsx            # Root with routing
    │   └── index.css          # Tailwind + custom styles
    └── .env                   # VITE_API_URL
```

## Setup Instructions

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/pincode_db?retryWrites=true&w=majority
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Import CSV Data

Place your PIN code CSV file in the project, then run:

```bash
cd backend
node utils/importCSV.js ../data/pincode.csv
```

The import script expects these CSV columns (case-insensitive):
- `officename`, `pincode`, `officeType`, `Deliverystatus`
- `divisionname`, `regionname`, `circlename`
- `Taluk`, `Districtname`, `statename`

### 4. Run the Application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/states` | All distinct states |
| GET | `/api/states/:state/districts` | Districts for a state |
| GET | `/api/states/:state/districts/:district/taluks` | Taluks for a district |
| GET | `/api/pincodes?state=&district=&taluk=&page=&limit=` | Filtered + paginated data |
| GET | `/api/search?q=` | Partial search |
| GET | `/api/pincode/:pincode` | Single PIN code details |
| GET | `/api/stats` | Overview statistics |
| GET | `/api/stats/state-distribution` | Count per state |
| GET | `/api/stats/delivery-distribution` | Delivery vs non-delivery |
| GET | `/api/export?state=&district=` | Export as CSV |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats cards, bar chart, pie chart |
| `/explore` | Search, filter, and browse PIN codes with pagination |
| `/pincode/:pincode` | Detailed view of a specific PIN code |
| `/about` | App info, tech stack, API docs |

## Example API Calls

```bash
# Get all states
curl http://localhost:5000/api/states

# Get districts in Maharashtra
curl http://localhost:5000/api/states/MAHARASHTRA/districts

# Search for "Mumbai"
curl http://localhost:5000/api/search?q=Mumbai

# Get pincodes with pagination
curl "http://localhost:5000/api/pincodes?state=KARNATAKA&page=1&limit=10"

# Get stats
curl http://localhost:5000/api/stats

# Export CSV
curl -O http://localhost:5000/api/export?state=DELHI
```
