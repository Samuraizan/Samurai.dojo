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
