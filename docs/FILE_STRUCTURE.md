# Samurai Dojo File Structure

## Root Directory Structure
```
samurai-dojo/
├── app/                    # Next.js application directory
├── docs/                   # Documentation
├── public/                 # Static assets
├── supabase/              # Database configuration
├── .next/                 # Next.js build output
├── node_modules/          # Dependencies
├── .env                   # Environment variables
├── .env.example           # Environment template
├── .env.local            # Local environment variables
├── Dockerfile.dev        # Development container
├── docker-compose.yml    # Container orchestration
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── vercel.json          # Vercel deployment config
```

## Application Structure
```
app/
├── commandcenter/        # Command & Control Center
│   ├── components/      # Command UI components
│   ├── hooks/          # Command center hooks
│   └── utils/          # Command utilities
│
├── ogsenpai/           # OG Senpai Core
│   ├── agents/        # Agent implementations
│   ├── core/          # Core functionality
│   ├── interfaces/    # TypeScript interfaces
│   └── utils/         # Utility functions
│
├── components/         # Shared UI components
│   ├── agents/        # Agent UI components
│   ├── chat/          # Chat components
│   ├── layout/        # Layout components
│   ├── skills/        # Skill components
│   └── ui/            # Base UI components
│
├── lib/               # Core libraries
│   ├── api/          # API utilities
│   ├── db/           # Database utilities
│   ├── hooks/        # Shared hooks
│   └── utils/        # Shared utilities
│
├── api/              # API routes
│   ├── agents/       # Agent endpoints
│   ├── auth/         # Authentication
│   └── skills/       # Skill endpoints
│
├── (routes)/         # Application routes
│   ├── dashboard/    # Dashboard pages
│   ├── projects/     # Project pages
│   └── about/        # About pages
│
└── utils/            # Global utilities
```

## Documentation Structure
```
docs/
├── architecture/           # System architecture
│   ├── OGSENPAI.md       # OG Senpai documentation
│   ├── system-design.md  # System design
│   └── data-flow.md      # Data flow
│
├── components/            # Component documentation
│   ├── agents.md         # Agent components
│   ├── chat.md          # Chat system
│   └── skills.md        # Skills framework
│
├── lib/                  # Library documentation
│   ├── eliza.md         # ElizaOS specification
│   ├── auth.md          # Authentication
│   └── api.md           # API documentation
│
├── development/          # Development guides
│   ├── getting-started.md
│   ├── environment.md
│   └── deployment.md
│
└── INDEX.md             # Documentation index
```

## Test Structure
```
tests/
├── unit/                # Unit tests
│   ├── agents/         # Agent tests
│   ├── components/     # Component tests
│   └── utils/          # Utility tests
│
├── integration/         # Integration tests
│   ├── api/           # API tests
│   └── flows/         # Flow tests
│
└── e2e/                # End-to-end tests
    └── features/       # Feature tests
```

## Configuration Files
```
config/
├── supabase/           # Supabase configuration
│   ├── tables/        # Table definitions
│   └── functions/     # Database functions
│
├── typescript/         # TypeScript configuration
│   └── types/         # Global types
│
└── deployment/         # Deployment configuration
    ├── docker/        # Docker configuration
    └── vercel/        # Vercel configuration
``` 