# angular-spa

A ServiceStack Angular SPA template combining .NET 10.0 backend with Angular 21 frontend. The project uses a layered architecture with clear separation between API, business logic, DTOs, and frontend.

![](https://github.com/ServiceStack/docs.servicestack.net/blob/main/MyApp/wwwroot/img/pages/templates/angular-spa.webp)

> Browse [source code](https://github.com/NetCoreTemplates/angular-spa), view live demo [angular-spa.web-templates.io](https://angular-spa.web-templates.io) and install with:

## Quick Start

```bash
npx create-net angular-spa MyProject
```

## Jumpstart with Copilot

Instantly [scaffold a new App with this template](https://github.com/new?template_name=angular-spa&template_owner=NetCoreTemplates) using GitHub Copilot, just describe the features you want and watch Copilot build it!

### Angular with Modern Features

- **Standalone Components** - No NgModules, cleaner component architecture
- **Signal-based State Management** - Reactive state with Angular's new signals API
- **TypeScript 5.9** - Latest TypeScript features and improved type safety
- **Tailwind CSS 4** - Utility-first styling with dark mode support

### .NET 10 Backend

- **ServiceStack v10** - High-performance .NET APIs with AutoQuery CRUD
- **Entity Framework Core 10** - For ASP.NET Core Identity
- **OrmLite** - Fast, typed POCO ORM for application data
- **SQLite** - Zero-configuration database (easily swap for PostgreSQL, SQL Server, etc.)

### Upgrading to an production RDBMS

To switch from SQLite to PostgreSQL/SQL Server/MySQL:

1. Install preferred RDBMS (`ef-postgres`, `ef-mysql`, `ef-sqlserver`), e.g:

```bash
npx add-in ef-postgres
```

2. Install `db-identity` to also switch to use this RDBMS for [Background Jobs](https://docs.servicestack.net/rdbms-background-jobs) and [Request Logs Analytics](https://docs.servicestack.net/admin-ui-rdbms-analytics):

```bash
npx add-in db-identity
```

## Simplified .NET + Angular Development Workflow

- Single endpoint `https://localhost:5001` for both .NET and Angular UI (no dev certs required)
- ASP.NET Core proxies requests to Angular dev server (port 4200)
- Hot Module Replacement (HMR) support for instant UI updates
- WebSocket proxying for Angular HMR functionality

![](https://docs.servicestack.net/img/pages/templates/angular-dev.svg)

## .NET Angular App with Static Export

**Angular SPA** uses **static export**, where a production build of the Angular App is generated at deployment and published together with the .NET App in its `/wwwroot` folder, utilizing static file serving to render its UI.

This minimal `angular-spa` starting template is perfect for your next AI Assisted project, offering a streamlined foundation for building modern web applications with **Angular 21** and **.NET 10**:

![](https://docs.servicestack.net/img/pages/templates/static-prod.svg)

## Key Features

### 🔐 ASP.NET Core Identity Authentication

Full authentication system with beautifully styled Tailwind CSS pages:
- User registration and login
- Email confirmation
- Password reset
- Profile management
- Role-based authorization

### ⚡ Rapid AutoQuery CRUD dev workflow

Quickly generate complete C# [CRUD APIs](https://docs.servicestack.net/autoquery/crud) and [DB Migrations](https://docs.servicestack.net/ormlite/db-migrations) from simple [TypeScript data models](https://localhost:5002/autoquery/okai-models):

1. Create a new feature

```bash
npx okai init MyFeature
```

2. Define your TypeScript data models in `MyFeature.d.ts`, e.g:

```bash
code MyApp.ServiceModel/MyFeature.d.ts
```

3. When ready, generate C# APIs and migrations

```bash
npx okai MyFeature.d.ts
```

4. Apply database migrations

```bash
npm run migrate
```

### Use AI for quick scaffolding

To help quickly scaffold your data models and features, use ServiceStack's AI assistant. Example of creating AutoQuery CRUD APIs for managing products:

```bash
npx okai "Manage products price and inventory"
```

### 🤖 AI Chat Integration

Built-in AI Chat API support with multiple provider options:
- ServiceStack AI
- OpenAI, Anthropic, Google, Groq
- Ollama for local models
- OpenRouter and more

### 🔑 API Keys Management

Secure API key authentication with:
- Admin-managed API keys
- User self-service key generation
- Scopes and features configuration

### 📊 Background Jobs

Durable background job processing with:
- Command-based job execution
- Recurring job scheduling
- SMTP email sending via background workers

### 📝 Request Logging

SQLite-backed request logging for:
- API request tracking
- Error monitoring
- Performance analysis

### 🔍 Built-in Admin UIs

- **/ui** - ServiceStack API Explorer
- **/admin-ui** - Database management, user administration
- **/swagger** - OpenAPI documentation (development mode)

## Architecture Highlights

### Hybrid Development Model

During development, `dotnet watch` starts both the .NET backend and Angular dev server with Hot Module Replacement. In production, Angular builds to static files served directly by ASP.NET Core.

### Modular Configuration

Clean separation of concerns with `IHostingStartup` pattern:
- [Configure.AppHost.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Configure.AppHost.cs) - Main ServiceStack AppHost registration
- [Configure.Auth.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Configure.Auth.cs) - ServiceStack AuthFeature with ASP.NET Core Identity integration
- [Configure.AutoQuery.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Configure.AutoQuery.cs) - AutoQuery features and audit events
- [Configure.Db.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Configure.Db.cs) - Database setup (OrmLite for app data, EF Core for Identity)
- [Configure.Db.Migrations.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Configure.Db.Migrations.cs) - Runs OrmLite and EF DB Migrations and creates initial users
- [Configure.BackgroundJobs.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Configure.BackgroundJobs.cs) - Background job processing
- [Configure.HealthChecks.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Configure.HealthChecks.cs) - Health monitoring endpoint

This pattern keeps [Program.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Program.cs) clean and separates concerns.

### Type-Safe API Client

Auto-generated TypeScript DTOs ensure type safety across the stack:

```typescript
import { QueryBookings } from '@/dtos'

const response = await client.api(new QueryBookings({ minCost: 100 }))
if (response.succeeded) {
    console.log(response.response!.results)
}
```

## Deployment Ready

GitHub Actions workflows included for:
- **CI/CD** - Automated build and test
- **Container Builds** - Docker image creation
- **Kamal Deployment** - One-command production deployment with SSL

### Kamal Deployments

All deployments include the GitHub Action workflows to deploy your App to [any Linux Server with Kamal](https://docs.servicestack.net/kamal-deploy) using Docker, SSH and GitHub Container Registry (ghcr).

## AI-Assisted Development with CLAUDE.md

As part of our objectives of improving developer experience and embracing modern AI-assisted development workflows - all new .NET React templates include a comprehensive `AGENTS.md` file designed to optimize AI-assisted development workflows.

### What is CLAUDE.md?

`CLAUDE.md` and [AGENTS.md](https://agents.md) onboards Claude (and other AI assistants) to your codebase by using a structured documentation file that provides it with complete context about your project's architecture, conventions, and technology choices. This enables more accurate code generation, better suggestions, and faster problem-solving.

### What's Included

Each template's `AGENTS.md` contains:

- **Project Architecture Overview** - Technology stack, design patterns, and key architectural decisions
- **Project Structure** - Gives Claude a map of the codebase
- **ServiceStack Conventions** - DTO patterns, Service implementation, AutoQuery, Authentication, and Validation
- **React Integration** - TypeScript DTO generation, API client usage, component patterns, and form handling
- **Database Patterns** - OrmLite setup, migrations, and data access patterns
- **Common Development Tasks** - Step-by-step guides for adding APIs, implementing features, and extending functionality
- **Testing & Deployment** - Test patterns and deployment workflows

### Extending with Project-Specific Details

The existing `CLAUDE.md` serves as a solid foundation, but for best results, you should extend it with project-specific details like the purpose of the project, key parts and features of the project and any unique conventions you've adopted.

### Benefits

- **Faster Onboarding** - New developers (and AI assistants) understand project conventions immediately
- **Consistent Code Generation** - AI tools generate code following your project's patterns
- **Better Context** - AI assistants can reference specific ServiceStack patterns and conventions
- **Reduced Errors** - Clear documentation of framework-specific conventions
- **Living Documentation** - Keep it updated as your project evolves

### How to Use

Claude Code and most AI Assistants already support automatically referencing `CLAUDE.md` and `AGENTS.md` files, for others you can just include it in your prompt context when asking for help, e.g:

> Using my project's AGENTS.md, can you help me add a new AutoQuery API for managing Products?

The AI will understand your App's ServiceStack conventions, React setup, and project structure, providing more accurate and contextual assistance.
