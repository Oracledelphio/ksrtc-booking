# KSRTC Booking System

A modern bus booking system for Kerala State Road Transport Corporation (KSRTC) built with Next.js, TypeScript, and Prisma.

## Features

- 🎨 **Beautiful Kerala-themed UI** with traditional green and brown colors
- 🚌 **Route Management** - Browse all available bus routes across Kerala
- 🔍 **Smart Search** - Find buses by source and destination
- 💺 **Seat Selection** - Interactive seat booking interface
- 👤 **User Authentication** - Secure signup and login system
- 📱 **Responsive Design** - Works perfectly on all devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Oracledelphio/ksrtc-booking.git
   cd ksrtc-booking/ksrtc-reservation-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database configuration.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ksrtc-reservation-system/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── (pages)/           # Page components
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (development), PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt
- **UI Components**: Radix UI + shadcn/ui

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Setup

The application uses SQLite for development with mock data. For production:

1. Set up a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env` file
3. Run migrations: `npx prisma migrate deploy`
4. Seed the database: `npx prisma db seed`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Kerala State Road Transport Corporation (KSRTC)
- Traditional Kerala design inspiration
- Next.js and Vercel teams for excellent documentation