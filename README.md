# Samurai Dojo

Advanced AI training and skill development platform built with Next.js and Supabase.

## Features

- 🎯 Skill tracking and progression
- 💬 AI-powered chat assistant
- 🔐 Secure authentication
- ⚡ Real-time updates
- 🎨 Clean, minimal design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd samurai-dojo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── (routes)/           # Main application routes
│   ├── dashboard/      # Dashboard page
│   ├── chat/          # Chat interface
│   └── test/          # Testing environment
├── components/         # Reusable components
├── lib/               # Utilities and API
└── public/            # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional, for local development)
- Supabase account

### Environment Setup

1. Configure Supabase:
   - Create a new project in Supabase
   - Set up authentication providers
   - Run necessary database migrations

2. Environment Variables:
```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_APP_URL=your_app_url
```

### Docker Development

Run with Docker Compose:
```bash
docker-compose up
```

### Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run lint
npm run lint
```

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy with:
```bash
vercel --prod
```

### Docker Deployment

1. Build the image:
```bash
docker build -t samurai-dojo .
```

2. Run the container:
```bash
docker run -p 3000:3000 samurai-dojo
```

## Architecture

### Core Components

- **Authentication**: Handled by Supabase Auth
- **Database**: Postgres via Supabase
- **API Routes**: Serverless functions in app/api
- **State Management**: React Context + Hooks
- **UI Components**: Custom components with Tailwind

### Data Flow

1. Client requests -> Next.js Server Components
2. Server Components -> Supabase Data
3. Real-time updates via Supabase subscriptions
4. State management through React Context

### Security

- All API routes are protected with middleware
- Environment variables are properly secured
- CORS policies are implemented
- Rate limiting on API routes

## Monitoring

- Vercel Analytics for performance monitoring
- Error tracking with Sentry
- Custom logging implementation
- Real-time database monitoring
