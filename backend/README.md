# Property Management System - Backend

Backend API for the Property Management System built with Node.js, Express, and MongoDB.

## Features
- Property & Unit Management
- Tenant Management  
- Payment Processing (KES Currency)
- Maintenance Requests
- Financial Reporting
- Authentication & Authorization
- File Upload Support

## Installation

1. Install dependencies:
\\\ash
npm install
\\\

2. Configure environment variables:
\\\ash
cp .env.example .env
# Edit .env with your configurations
\\\

3. Start development server:
\\\ash
npm run dev
\\\

## API Endpoints

- **Auth**: \/api/auth\
- **Properties**: \/api/properties\
- **Units**: \/api/units\
- **Tenants**: \/api/tenants\
- **Payments**: \/api/payments\
- **Maintenance**: \/api/maintenance\
- **Reports**: \/api/reports\
- **Dashboard**: \/api/dashboard\

## Currency
All monetary values are in **KES (Kenyan Shilling)**.

## File Structure
\\\
backend/
├── src/
│   ├── config/         # Database & app configuration
│   ├── controllers/    # Route controllers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── utils/          # Utility functions
├── uploads/            # File uploads
├── logs/              # Application logs
└── server.js          # Entry point
\\\

## Development
- \
pm run dev\ - Start with nodemon
- \
pm start\ - Start production server
- \
pm test\ - Run tests
