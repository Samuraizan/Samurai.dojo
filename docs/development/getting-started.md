# Getting Started

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.x or higher)
- npm or yarn
- Docker (for local development)
- Git

## Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/samurai-dojo.git
cd samurai-dojo
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

4. **Database Setup**
```bash
docker-compose up -d
```

## Development

1. **Start Development Server**
```bash
npm run dev
# or
yarn dev
```
Access the application at `http://localhost:3000`

2. **Run Tests**
```bash
npm run test
# or
yarn test
```

3. **Lint Code**
```bash
npm run lint
# or
yarn lint
```

## Project Structure

```
samurai-dojo/
├── app/                # Next.js application
│   ├── components/     # React components
│   ├── lib/           # Core libraries
│   └── (routes)/      # Application routes
├── public/            # Static assets
├── docs/             # Documentation
└── supabase/         # Database configuration
```

## Development Workflow

1. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**
- Write code following style guide
- Add tests
- Update documentation

3. **Commit Changes**
```bash
git add .
git commit -m "feat: your feature description"
```

4. **Push Changes**
```bash
git push origin feature/your-feature-name
```

5. **Create Pull Request**
- Follow PR template
- Request review
- Address feedback

## Code Style

- Follow TypeScript best practices
- Use ESLint configuration
- Follow Prettier formatting
- Write meaningful commit messages

## Testing

1. **Unit Tests**
```bash
npm run test:unit
```

2. **Integration Tests**
```bash
npm run test:integration
```

3. **E2E Tests**
```bash
npm run test:e2e
```

## Debugging

1. **Development Tools**
- Chrome DevTools
- React Developer Tools
- Next.js Debug Mode

2. **Logging**
```typescript
console.log('Debug:', data)
console.error('Error:', error)
```

3. **Error Handling**
```typescript
try {
  // Your code
} catch (error) {
  console.error('Error:', error)
  // Handle error
}
```

## Build and Deploy

1. **Build Application**
```bash
npm run build
# or
yarn build
```

2. **Production Start**
```bash
npm run start
# or
yarn start
```

3. **Deploy to Vercel**
```bash
vercel deploy
```

## Common Issues

1. **Node Version Mismatch**
```bash
nvm use 18
```

2. **Port Already in Use**
```bash
kill -9 $(lsof -t -i:3000)
```

3. **Database Connection Issues**
- Check environment variables
- Verify Docker containers
- Check network connectivity

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Support

- Create an issue in the repository
- Contact the development team
- Check existing documentation

## Next Steps

- [Architecture Overview](../architecture/README.md)
- [Component Guide](../components/README.md)
- [API Documentation](../api/README.md)
- [Contributing Guide](../contributing/README.md) 