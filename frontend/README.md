# Petrol Station Management System

A modern, accessible, and responsive web application for managing petrol station operations built with React, TypeScript, Vite, and TailwindCSS.

## Features

- **Authentication**: Secure login/register with JWT tokens
- **Dashboard**: Real-time overview of sales, inventory, and alerts
- **Fuel Management**: Add, edit, delete, and track fuel types and prices
- **Pump & Attendant Management**: Assign attendants to pumps and manage shifts
- **Sales Records**: Log and track all transactions with filtering and export
- **Reports & Analytics**: Visual dashboards with daily sales and fuel mix analysis
- **Settings**: User profile management and system preferences
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

## Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd petrol-station-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file in the root directory:
\`\`\`
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Backend Setup

The application expects a Node.js + Express backend running on `http://localhost:5000` with the following endpoints:

- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `GET/POST/PUT/DELETE /api/fuel` - Fuel management
- `GET/POST /api/sales` - Sales records
- `GET/POST /api/attendants` - Staff management
- `GET /api/pumps` - Pump information
- `GET /api/reports` - Analytics data

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High-contrast color scheme (WCAG 2.1 AA)
- Screen reader optimized
- Focus indicators on all interactive elements
- Alt text for images
- Color-blind friendly palette

## Technology Stack

- **Frontend**: React 18, TypeScript, Next.js
- **Styling**: TailwindCSS, custom CSS
- **Charts**: Recharts
- **HTTP Client**: Fetch API
- **State Management**: React Context + Hooks
- **Authentication**: JWT (localStorage)

## Project Structure

\`\`\`
petrol-station-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── fuel-management/
│   ├── pump-attendant/
│   ├── sales-records/
│   ├── reports/
│   └── settings/
├── components/
│   ├── ui/
│   ├── layout/
│   └── dashboard/
├── context/
│   └── auth-context.tsx
├── styles/
│   └── globals.css
└── README.md
\`\`\`

## Development

- Run dev server: `npm run dev`
- Build for production: `npm run build`
- Start production build: `npm start`

## License

This project is licensed under the MIT License.
