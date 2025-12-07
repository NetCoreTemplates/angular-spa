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

## Simplified .NET + Angular Development Workflow

- Single endpoint `https://localhost:5001` for both .NET and Angular UI (no dev certs required)
- ASP.NET Core proxies requests to Angular dev server (port 4200)
- Hot Module Replacement (HMR) support for instant UI updates
- WebSocket proxying for Angular HMR functionality

### Hybrid Development Model

During development, `dotnet watch` starts both the .NET backend and Angular dev server with Hot Module Replacement. In production, Angular builds to static files served directly by ASP.NET Core.

![](https://docs.servicestack.net/img/pages/templates/angular-dev.svg)

## .NET Angular App with Static Export

**Angular SPA** uses **static export**, where a production build of the Angular App is generated at deployment and published together with the .NET App in its `/wwwroot` folder, utilizing static file serving to render its UI.

This minimal `angular-spa` starting template is perfect for your next AI Assisted project, offering a streamlined foundation for building modern web applications with **Angular 21** and **.NET 10**:

![](https://docs.servicestack.net/img/pages/templates/static-prod.svg)

## Core Technologies

### .NET Frontend (Integrated + Optional)
- **Razor Pages** - For Identity Auth UI (`/Identity` routes)

### Backend (.NET 10.0)
- **ServiceStack 10.x** - High-performance web services framework
- **ASP.NET Core Identity** - Complete authentication & authorization system
- **Entity Framework Core** - For Identity data management
- **OrmLite** - ServiceStack's fast, lightweight Typed ORM for application data
- **SQLite** - Default database - [Upgrade to PostgreSQL/SQL Server/MySQL](#upgrading-to-enterprise-database)

## Major Features

### 1. Authentication & Authorization
- ASP.NET Core Identity integration with role-based access control
- Custom user sessions with additional claims
- Admin users feature for user management at `/admin-ui/users`
- Email confirmation workflow (configurable SMTP)
- Razor Pages for Identity UI (`/Identity` routes)

### [2. AutoQuery CRUD](#autoquery-crud-dev-workflow)
- Declarative API development with minimal code
- Complete Auth-protected CRUD operations (see Bookings example at `/bookings-auto`)
- Automatic audit trails (created/modified/deleted tracking)
- Built-in validation and authorization
- Type-safe TypeScript DTOs auto-generated from C# models

### 3. Background Jobs
- `BackgroundsJobFeature` for async task processing
- Command pattern for job execution
- Email sending via background jobs
- Recurring job scheduling support
- Uses monthly rolling Sqlite databases by default - [Upgrade to PostgreSQL/SQL Server/MySQL](#upgrading-to-enterprise-database)

### 4. Developer Experience
- **Admin UI** at `/admin-ui` for App management
- **Health checks** at `/up` endpoint
- **Modular startup** configuration pattern
- **Code-first migrations** with OrmLite
- **Docker support** with container publishing
- **Kamal deployment** configuration included

## Architecture Highlights

### Project Structure

```
MyApp/                         # .NET Backend (hosts both .NET and Angular build output)
├── Configure.*.cs             # Modular startup configuration
├── Migrations/                # EF Core Identity migrations + OrmLite app migrations
├── Pages/                     # Identity Auth Razor Pages
└── wwwroot/                   # Production static files (from MyApp.Client/dist)

MyApp.Client/                  # Angular Frontend
├── src/
│   ├── app/                   # Angular components and pages
│   ├── services/              # Shared services including auth (signal-based)
│   ├── components/            # Angular components
├── dtos.ts                    # Auto-generated from C# (via `npm run dtos`)
├── styles/                    # Tailwind CSS
└── angular.json               # Angular CLI configuration

MyApp.ServiceModel/            # DTOs & API contracts
├── *.cs                       # C# Request/Response DTOs
├── api.d.ts                   # TypeScript data models Schema
└── *.d.ts                     # TypeScript data models for okai code generation

MyApp.ServiceInterface/        # Service implementations
├── Data/                      # EF Core DbContext and Identity models
└── *Services.cs               # ServiceStack service implementations

MyApp.Tests/                   # .NET tests (NUnit)
├── IntegrationTest.cs         # API integration tests
└── MigrationTasks.cs          # Migration task runner

config/
└── deploy.yml                 # Kamal deployment settings
.github/
└── workflows/
    ├── build.yml              # CI build and test
    ├── build-container.yml    # Container image build
    └── release.yml            # Production deployment with Kamal
```

### Modular Configuration

Clean separation of concerns with `IHostingStartup` pattern:
- [Configure.AppHost.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Configure.AppHost.cs) - Main ServiceStack AppHost registration
- [Configure.Auth.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Configure.Auth.cs) - ServiceStack AuthFeature with ASP.NET Core Identity integration
- [Configure.AutoQuery.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Configure.AutoQuery.cs) - AutoQuery features and audit events
- [Configure.OpenApi.cs](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp/Configure.OpenApi.cs) - OpenAPI features and Swagger UI
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

## Configuration

### Key Configuration Files

- **MyApp/appsettings.json** - Application configuration
- **MyApp.Client/next.config.mjs** - Next.js configuration
- **MyApp.Client/styles/index.css** - Tailwind CSS configuration
- **config/deploy.yml** - Kamal deployment settings

### App Settings

Configure in `appsettings.json` or environment:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "DataSource=App_Data/app.db;Cache=Shared"
  },
  "SmtpConfig": {
    "Host": "smtp.example.com",
    "Port": 587,
    "FromEmail": "noreply@example.com",
    "FromName": "MyApp"
  },
  "AppConfig": {
    "BaseUrl": "https://myapp.example.com"
  }
}
```

### App Settings Secrets

Instead of polluting each GitHub Reposity with multiple App-specific GitHub Action Secrets, you can save all your secrets in a single `APPSETTINGS_PATCH` GitHub Action Secret to patch `appsettings.json` with environment-specific configuration using [JSON Patch](https://jsonpatch.com). E.g:

```json
[
    {
        "op":"replace",
        "path":"/ConnectionStrings/DefaultConnection",
        "value":"Server=service-postgres;Port=5432;User Id=dbuser;Password=dbpass;Database=dbname;Pooling=true;"
    },
    { "op":"add", "path":"/SmtpConfig", "value":{
        "UserName": "SmptUser",
        "Password": "SmptPass",
        "Host": "email-smtp.us-east-1.amazonaws.com",
        "Port": 587,
        "From": "noreply@example.org",
        "FromName": "MyApp",
        "Bcc": "copy@example.org"
      } 
    },
    { "op":"add", "path":"/Admins", "value": ["admin1@email.com","admin2@email.com"] },
    { "op":"add", "path":"/CorsFeature/allowOriginWhitelist/-", "value":"https://servicestack.net" }
]
```

### SMTP Email

Enable email sending by uncommenting in `Program.cs`:

```csharp
services.AddSingleton<IEmailSender<ApplicationUser>, EmailSender>();
```

## Upgrading to Enterprise Database

To switch from SQLite to PostgreSQL/SQL Server/MySQL:

1. Install preferred RDBMS (ef-postgres, ef-mysql, ef-sqlserver), e.g:

```bash
npx add-in ef-postgres
```

2. Install `db-identity` to use RDBMS `DatabaseJobsFeature` for background jobs and `DbRequestLogger` for Request Logs:

```bash
npx add-in db-identity
```

## AutoQuery CRUD Dev Workflow

For Rapid Development simple [TypeScript Data Models](https://docs.servicestack.net/autoquery/okai-models) can be used to generate C# AutoQuery APIs and DB Migrations.

### Cheat Sheet

### Create a new Table

Create a new Table use `init <Table>`, e.g:

```bash
npx okai init Table
```

This will generate an empty `MyApp.ServiceModel/<Table>.d.ts` file along with stub AutoQuery APIs and DB Migration implementations. 

### Use AI to generate the TypeScript Data Model

Or to get you started quickly you can also use AI to generate the initial TypeScript Data Model with:

```bash
npx okai "Table to store Customer Stripe Subscriptions"
```

This launches a TUI that invokes ServiceStack's okai API to fire multiple concurrent requests to frontier cloud 
and OSS models to generate the TypeScript Data Models required to implement this feature. 
You'll be able to browse and choose which of the AI Models you prefer which you can accept by pressing `a` 
to `(a) accept`. These are the data models [Claude Sonnet 4.5 generated](https://servicestack.net/text-to-blazor?id=1764337230546) for this prompt.

#### Regenerate AutoQuery APIs and DB Migrations

After modifying the `Table.d.ts` TypeScript Data Model to include the desired fields, re-run the `okai` tool to re-generate the AutoQuery APIs and DB Migrations:

```bash
npx okai Table.d.ts
```

> Command can be run anywhere within your Solution

After you're happy with your Data Model you can run DB Migrations to run the DB Migration and create your RDBMS Table:

```bash
npm run migrate
```

#### Making changes after first migration

If you want to make further changes to your Data Model, you can re-run the `okai` tool to update the AutoQuery APIs and DB Migrations, then run the `rerun:last` npm script to drop and re-run the last migration:

```bash
npm run rerun:last
```

#### Removing a Data Model and all generated code

If you changed your mind and want to get rid of the RDBMS Table you can revert the last migration:

```bash
npm run revert:last
```

Which will drop the table and then you can get rid of the AutoQuery APIs, DB Migrations and TypeScript Data model with:

```bash
npx okai rm Transaction.d.ts
```

## Deployment

### Docker + Kamal

This project includes GitHub Actions for CI/CD with automatic Docker image builds and production [deployment with Kamal](https://docs.servicestack.net/kamal-deploy). The `/config/deploy.yml` configuration is designed to be reusable across projects—it dynamically derives service names, image paths, and volume mounts from environment variables, so you only need to configure your server's IP and hostname using GitHub Action secrets.

### GitHub Action Secrets

**Required - App Specific*:

The only secret needed to be configured per Repository.

| Variable | Example | Description |
|----------|---------|-------------|
| `KAMAL_DEPLOY_HOST` | `example.org` | Hostname used for SSL certificate and Kamal proxy |

**Required** (Organization Secrets):

Other Required variables can be globally configured in your GitHub Organization or User secrets which will
enable deploying all your Repositories to the same server.

| Variable | Example  | Description |
|----------|----------|-------------|
| `KAMAL_DEPLOY_IP`   | `100.100.100.100` | IP address of the server to deploy to |
| `SSH_PRIVATE_KEY`   | `ssh-rsa ...`     | SSH private key to access the server |
| `LETSENCRYPT_EMAIL` | `me@example.org`  | Email for Let's Encrypt SSL certificate |

**Optional**:

| Variable | Example | Description |
|----------|---------|-------------|
| `SERVICESTACK_LICENSE` | `...` | ServiceStack license key |

**Inferred** (from GitHub Action context):

These are inferred from the GitHub Action context and don't need to be configured.

| Variable | Source | Description |
|----------|--------|-------------|
| `GITHUB_REPOSITORY` | `${{ github.repository }}` | e.g. `acme/example.org` - used for service name and image |
| `KAMAL_REGISTRY_USERNAME` | `${{ github.actor }}` | GitHub username for container registry |
| `KAMAL_REGISTRY_PASSWORD` | `${{ secrets.GITHUB_TOKEN }}` | GitHub token for container registry auth |

#### Features

- **Docker containerization** with optimized .NET images
- **SSL auto-certification** via Let's Encrypt
- **GitHub Container Registry** integration
- **Volume persistence** for App_Data including any SQLite database

## AI-Assisted Development with CLAUDE.md

As part of our objectives of improving developer experience and embracing modern AI-assisted development workflows - all new .NET SPA templates include a comprehensive `AGENTS.md` file designed to optimize AI-assisted development workflows.

### What is CLAUDE.md?

`CLAUDE.md` and [AGENTS.md](https://agents.md) onboards Claude (and other AI assistants) to your codebase by using a structured documentation file that provides it with complete context about your project's architecture, conventions, and technology choices. This enables more accurate code generation, better suggestions, and faster problem-solving.

### What's Included

Each template's `AGENTS.md` contains:

- **Project Architecture Overview** - Technology stack, design patterns, and key architectural decisions
- **Project Structure** - Gives Claude a map of the codebase
- **ServiceStack Conventions** - DTO patterns, Service implementation, AutoQuery, Authentication, and Validation
- **API Integration** - TypeScript DTO generation, API client usage, component patterns, and form handling
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
