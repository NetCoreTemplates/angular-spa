# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a ServiceStack Angular SPA template combining .NET 10.0 backend with Angular 21 frontend. The project uses a layered architecture with clear separation between API, business logic, DTOs, and frontend.

## Common Commands

### Development

```bash
# Start both .NET and Vite dev servers (from project root)
dotnet watch

# After making changes to C# DTOs restart .NET before regenerating TypeScript DTOs by running:
cd MyApp.Client && npm run dtos
```

**Tailwind CSS (for Razor Pages):**
```bash
# Watch mode for styling (from MyApp directory)
npm run ui:dev

# Production build
npm run ui:build
```

**Full development setup:**
Run .NET backend, Razor Pages and Node Vite dev server in parallel:
```bash
cd MyApp && dotnet watch
```

**Using tailwind in new Razor Pages:**

Terminal 2: `cd MyApp && npm run ui:dev` (Tailwind watch)

### Testing

**Backend:**
```bash
# Run all .NET tests
cd MyApp.Tests && dotnet test
```

**Frontend:**
```bash
# Run Karma/Jasmine tests (from MyApp.Client directory)
npm test
```

### Database Migrations
```bash
# Run all migrations (both EF Core and OrmLite)
cd MyApp && npm run migrate

# Entity Framework migrations (for changes to Identity tables)
dotnet ef migrations add MigrationName
dotnet ef database update

# Revert last migration
cd MyApp && npm run revert:last

# Drop and re-run last migration (useful during development)
cd MyApp && npm run rerun:last
```

### AutoQuery CRUD Development (using okai)

```bash
# Create new AutoQuery CRUD feature with TypeScript data model
npx okai init Table

# Regenerate C# AutoQuery APIs and DB migration from .d.ts model
npx okai Table.d.ts

# Remove AutoQuery feature and all generated code
npx okai rm Table.d.ts
```

## Architecture

### Hybrid Development/Production Model

**Development Mode:**
- `dotnet watch` from MyApp starts .NET (port 5001) and Angular dev server (port 4200), accesible via `https://127.0.0.1:4200`
- ASP.NET Core proxies requests to Angular dev server via `NodeProxy` (configured in [Program.cs](MyApp/Program.cs#L41))
- Hot Module Replacement (HMR) enabled via WebSocket proxying using `MapNotFoundToNode`, `MapViteHmr`, `RunNodeProcess`, `MapFallbackToNode` in [Program.cs](MyApp/Program.cs)

**Production Mode:**
- Angular builds app to `MyApp.Client/dist/`, which is copied to `MyApp/wwwroot/` when published
- ASP.NET Core serves static files directly from `wwwroot` - no Node.js required
- Fallback to `index.html` for client-side routing

### Modular Startup Configuration

AppHost uses .NET's `IHostingStartup` pattern to split configuration across multiple files in `MyApp/`:
- [Configure.AppHost.cs](MyApp/Configure.AppHost.cs) - Main ServiceStack AppHost registration
- [Configure.Auth.cs](MyApp/Configure.Auth.cs) - ServiceStack AuthFeature with ASP.NET Core Identity integration
- [Configure.AutoQuery.cs](MyApp/Configure.AutoQuery.cs) - AutoQuery features and audit events
- [Configure.Db.cs](MyApp/Configure.Db.cs) - Database setup (OrmLite for app data, EF Core for Identity)
- [Configure.Db.Migrations.cs](MyApp/Configure.Db.Migrations.cs) - Runs OrmLite and EF DB Migrations and creates initial users
- [Configure.BackgroundJobs.cs](MyApp/Configure.BackgroundJobs.cs) - Background job processing
- [Configure.HealthChecks.cs](MyApp/Configure.HealthChecks.cs) - Health monitoring endpoint

This pattern keeps [Program.cs](MyApp/Program.cs) clean and separates concerns. Each `Configure.*.cs` file is auto-registered via `[assembly: HostingStartup]` attribute.

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

### Frontend Architecture

**Angular Standalone Components:**
- No NgModules, all components are standalone
- Signal-based state management (Angular 21+)
- Router configuration in `app.routes.ts`

**Key Services:**
- `auth.service.ts` - Authentication with signal-based state
- ServiceStack client for API communication

**Routing:**
- Client-side routing handled by Angular Router
- Fallback routing in production via `MapFallbackToFile("index.html")`

### Database Architecture

**Dual ORM Strategy:**
- **OrmLite**: All application data (faster, simpler, typed POCO ORM)
- **Entity Framework Core**: ASP.NET Core Identity tables only (Users, Roles, etc.)

Both use the same SQLite database by default (`App_Data/app.db`). Connection string in `appsettings.json`.

**Migration Files:**
- `MyApp/Migrations/20240301000000_CreateIdentitySchema.cs` - EF Core migration for Identity
- `MyApp/Migrations/Migration1000.cs` - OrmLite migration for app tables (e.g., Booking)

Run `npm run migrate` to execute both.

### Authentication Flow

1. ASP.NET Core Identity handles user registration/login via Razor Pages at `/Identity/*` routes
2. ServiceStack AuthFeature integrates with Identity via `IdentityAuth.For<ApplicationUser>()` in [Configure.Auth.cs](MyApp/Configure.Auth.cs)
3. Custom claims added via `AdditionalUserClaimsPrincipalFactory` and `CustomUserSession`
4. ServiceStack services use `[ValidateIsAuthenticated]` and `[ValidateHasRole]` attributes for authorization (see [Bookings.cs](MyApp.ServiceModel/Bookings.cs))

### ServiceStack .NET APIs

ServiceStack APIs adopt a [DTOs-first approach utilizing message-based APIs](https://docs.servicestack.net/api-design). To create ServiceStack APIs create all related DTOs used in the API (aka Service Contracts) into a single file in the `MyApp.ServiceModel` project, e.g:

```csharp
//MyApp.ServiceModel/Bookings.cs

public class GetBooking : IGet, IReturn<GetBookingResponse>
{
    [ValidateGreaterThan(0)]
    public int Id { get; set; }
}
public class GetBookingResponse
{
    public Booking? Result { get; set; }
    public ResponseStatus? ResponseStatus { get; set; }
}
```

The response type of an API should be specified in the `IReturn<Response>` marker interface. APIs which don't return a response should implement `IReturnVoid` instead.

By convention, APIs return single results in a `T? Result` property, APIs returns multiple results of the same type in a `List<T> Results` property. Otherwise APIs returning results of different types should use intuitive property names in a flat structured Response DTO for simplicity.

These C# Server DTOs are used to generate the TypeScript `dtos.ts`.

#### Validating APIs

Any API Errors are automatically populated in the `ResponseStatus` property, inc. [Declarative Validation Attributes](https://docs.servicestack.net/declarative-validation) like `[ValidateGreaterThan]` and `[ValidateNotEmpty]` which validate APIs and return any error responses in `ResponseStatus`.

#### Protecting APIs

The Type Validation Attributes below should be used to protect APIs:

- `[ValidateIsAuthenticated]` - Only Authenticated Users
- `[ValidateIsAdmin]` - Only Admin Users
- `[ValidateHasRole]` - Only Authenticated Users assigned with the specified role
- `[ValidateApiKey]` - Only Users with a valid API Key

```csharp
//MyApp.ServiceModel/Bookings.cs
[ValidateHasRole("Employee")]
public class CreateBooking : ICreateDb<Booking>, IReturn<IdResponse>
{
   //...
}
```

#### Primary HTTP Method

APIs have a primary HTTP Method which if not specified uses HTTP **POST**. Use `IGet`, `IPost`, `IPut`, `IPatch` or `IDelete` to change the HTTP Verb except for AutoQuery APIs which have implied verbs for each CRUD operation.

#### API Implementations

ServiceStack API implementations should be added to `MyApp.ServiceInterface/`:

```csharp
//MyApp.ServiceInterface/BookingServices.cs
public class BookingServices(IAutoQueryDb autoquery) : Service
{
    public object Any(GetBooking request)
    {
        return new GetBookingResponse {
            Result = base.Db.SingleById<Booking>(request.Id)
                ?? throw HttpError.NotFound("Booking does not exist")
        };
    }

    // Example of overriding an AutoQuery API with a custom implementation 
    public async Task<object> Any(QueryBookings request)
    {
        using var db = autoQuery.GetDb(request, base.Request);
        var q = autoQuery.CreateQuery(request, base.Request, db);
        return await autoQuery.ExecuteAsync(request, q, base.Request, db);        
    }
}
```

APIs can be implemented with **sync** or **async** methods using `Any` or its primary HTTP Method e.g. `Get`, `Post`. 
The return type of an API implementation does not change behavior however returning `object` is recommended so its clear the Request DTO `IReturn<Response>` interface defines the APIs Response type and Service Contract.

The ServiceStack `Service` base class has convenience properties like `Db` to resolve an Open `IDbConnection` for that API and `base.Request` to resolve the `IRequest` context. All other dependencies required by the API should use constructor injection in a Primary Constructor.

A ServiceStack API typically returns the Response DTO defined in its Request DTO `IReturn<Response>` or an Error but can also return any raw [custom Return Type](https://docs.servicestack.net/service-return-types) like `string`, `byte[]`, `Stream`, `IStreamWriter`, `HttpResult` and `HttpError`.

### AutoQuery CRUD Pattern

ServiceStack's AutoQuery generates full CRUD APIs from declarative request DTOs. Example in [Bookings.cs](MyApp.ServiceModel/Bookings.cs):

- `QueryBookings : QueryDb<Booking>`   → GET    /api/QueryBookings with filtering/sorting/paging
- `CreateBooking : ICreateDb<Booking>` → POST   /api/CreateBooking
- `UpdateBooking : IPatchDb<Booking>`  → PATCH  /api/UpdateBooking
- `DeleteBooking : IDeleteDb<Booking>` → DELETE /api/DeleteBooking

**No service implementation required** - AutoQuery handles it. Audit fields (`CreatedBy`, `ModifiedBy`, etc.) auto-populated via `[AutoApply(Behavior.AuditCreate)]` attributes.

[AutoQuery CRUD Docs](https://react-templates.net/docs/autoquery/crud)

### TypeScript DTO Generation

After changing C# DTOs in `MyApp.ServiceModel/`, restart the .NET Server then run:
```bash
cd MyApp.Client && npm run dtos
```

This calls ServiceStack's `/types/typescript` endpoint and updates `dtos.ts` with type-safe client DTOs. The Vite dev server auto-reloads.

### okai AutoQuery Code Generation

The `npx okai` tool generates C# AutoQuery APIs and migrations from TypeScript data models (`.d.ts` files):

1. **TypeScript data model** (`MyApp.ServiceModel/Bookings.d.ts`) defines the entity with decorators
2. **C# AutoQuery APIs** (`MyApp.ServiceModel/Bookings.cs`) - auto-generated CRUD request/response DTOs
3. **C# OrmLite migration** (`MyApp/Migrations/Migration1000.cs`) - auto-generated schema creation

This enables rapid prototyping: edit the `.d.ts` model, run `npx okai Bookings.d.ts`, then `npm run migrate`.

**Important:** The `.d.ts` files use special decorators (e.g., `@validateHasRole`, `@autoIncrement`) that map to C# attributes and .NET Types. The valid schema for these is defined in [api.d.ts](MyApp.ServiceModel/api.d.ts). Reference [Bookings.d.ts](MyApp.ServiceModel/Bookings.d.ts) for examples.

### AutoQuery APIs

[C# AutoQuery APIs](https://react-templates.net/docs/autoquery/querying) allow creating queryable C# APIs for RDBMS Tables with just a Request DTO definition, e.g:

```csharp
public class QueryBookings : QueryDb<Booking>
{
    public int? Id { get; set; }
    public decimal? MinCost { get; set; }
    public List<decimal>? CostBetween { get; set; }
    public List<int>? Ids { get; set; }
}
```

It uses these conventions to determine the behavior of each property filter:

```csharp
ImplicitConventions = new() {
    {"%Above%",      "{Field} >  {Value}"},
    {"Begin%",       "{Field} >  {Value}"},
    {"%Beyond%",     "{Field} >  {Value}"},
    {"%Over%",       "{Field} >  {Value}"},
    {"%OlderThan",   "{Field} >  {Value}"},
    {"%After%",      "{Field} >  {Value}"},
    {"OnOrAfter%",   "{Field} >= {Value}"},
    {"%From%",       "{Field} >= {Value}"},
    {"Since%",       "{Field} >= {Value}"},
    {"Start%",       "{Field} >= {Value}"},
    {"%Higher%",     "{Field} >= {Value}"},
    {"Min%",         "{Field} >= {Value}"},
    {"Minimum%",     "{Field} >= {Value}"},
    {"Behind%",      "{Field} <  {Value}"},
    {"%Below%",      "{Field} <  {Value}"},
    {"%Under%",      "{Field} <  {Value}"},
    {"%Lower%",      "{Field} <  {Value}"},
    {"%Before%",     "{Field} <  {Value}"},
    {"%YoungerThan", "{Field} <  {Value}"},
    {"OnOrBefore%",  "{Field} <  {Value}"},
    {"End%",         "{Field} <  {Value}"},
    {"Stop%",        "{Field} <  {Value}"},
    {"To%",          "{Field} <  {Value}"},
    {"Until%",       "{Field} <  {Value}"},
    {"Max%",         "{Field} <  {Value}"},
    {"Maximum%",     "{Field} <  {Value}"},

    {"%GreaterThanOrEqualTo%", "{Field} >= {Value}"},
    {"%GreaterThan%",          "{Field} >  {Value}"},
    {"%LessThan%",             "{Field} <  {Value}"},
    {"%LessThanOrEqualTo%",    "{Field} <  {Value}"},
    {"%NotEqualTo",            "{Field} <> {Value}"},

    {"Like%",        "UPPER({Field}) LIKE UPPER({Value})"},
    {"%In",          "{Field} IN ({Values})"},
    {"%Ids",         "{Field} IN ({Values})"},
    {"%Between%",    "{Field} BETWEEN {Value1} AND {Value2}"},
    {"%HasAll",      "{Value} & {Field} = {Value}"},
    {"%HasAny",      "{Value} & {Field} > 0"},

    {"%IsNull",      "{Field} IS NULL"},
    {"%IsNotNull",   "{Field} IS NOT NULL"},
};
```

Each convention key includes `%` wildcards to define where a DataModel field names can appear, either as a Prefix, Suffix or both. The convention value describes the SQL filter that gets applied to the query when the property is populated.

Properties that matches a DataModel field performs an exact query `{Field} = {Value}`, e.g:

```typescript
const api = client.api(new QueryBookings({ id:1 }))
```

As `MinCost` matches the `"Min%"` convention it applies the `Cost >= 100` filter to the query:

```typescript
const api = client.api(new QueryBookings({ minCost:100 }))
```

As `CostBetween` matches the `"%Between%"` convention it applies the `Cost BETWEEN 100 AND 200` filter to the query:

```typescript
const api = client.api(new QueryBookings({ costBetween:[100,200] }))
```

AutoQuery also matches on pluralized fields where `Ids` matches `Id` and applies the `Id IN (1,2,3)` filter:

```typescript
const api = client.api(new QueryBookings({ ids:[1,2,3] }))
```

Multiple Request DTO properties applies mutliple **AND** filters, e.g:

```typescript
const api = client.api(new QueryBookings({ minCost:100, ids:[1,2,3] }))
```

Applies the `(Cost >= 100) AND (Id IN (1,2,3))` filter.

## Key Conventions

### API Client Usage

Frontend code imports from `lib/gateway.ts`:

```typescript
import { QueryBookings } from '@/lib/dtos'

private client = inject(JsonServiceClient);

const response = await client.api(new QueryBookings())
```

The `client` is a configured `JsonServiceClient` pointing to `/api` (proxied to .NET backend).

All .NET APIs are accessible by Request DTOs which implement either a `IReturn<ResponseType>` a `IReturnVoid` interface which defines the API Response, e.g:

```typescript
export class Hello implements IReturn<HelloResponse>, IGet
{
    public name: string;
    public constructor(init?: Partial<Hello>) { (Object as any).assign(this, init); }
}
export class HelloResponse
{
    public result: string;
    public constructor(init?: Partial<HelloResponse>) { (Object as any).assign(this, init); }
}
```

### ServiceStack API Client Pattern

All client `api`, `apiVoid` and `apiForm` methods **never throws exceptions** - it always returns an `ApiResult<T>` which contains either a **response** for successful responses or an **error** with a populated `ResponseStatus`, as such using `try/catch` around `client.api*` calls is always wrong as it implies it would throw an Exception, when it never does.

The examples below show typical usage:

The `api` and `apiVoid` APIs return an `ApiResult<Response>` which holds both successful and failed API Responses:

```typescript
const api = await client.api(new Hello({ name }))
if (api.succeeded) {
    console.log(`The API succeded:`, api.response)
} else if (api.error) {
    console.log(`The API failed:`, api.error)
}
```

The `apiForm` API can use a HTML Form's FormData for its Request Body together with an APIs **empty Request DTO**, e.g:

```typescript
const submit = async (e: Event) => {
    const form = e.currentTarget as HTMLFormElement
    const api = await client.apiForm(new CreateContact(), new FormData(form))
    if (api.succeeded) {
        console.log(`The API succeded:`, api.response)
    } else if (api.error) {
        console.log(`The API failed:`, api.error)
    }
}
```

Using `apiForm` is required for multipart/form-data File Uploads.

### Routing

- `/api/*` → ServiceStack services
- `/Identity/*` → ASP.NET Core Identity Razor Pages
- `/ui/*` → ServiceStack API Explorer
- `/admin-ui/*` → ServiceStack Admin UI (requires Admin role)
- `/types/typescript` → ServiceStack .NET API TypeScript DTOs (for dtos.ts)
- All other routes → Angular SPA (via fallback in dev/prod)

### Razor Pages Integration

The template includes Razor Pages for Identity UI (`/Identity` routes) that coexist with the Angular SPA. These use Tailwind CSS compiled from `MyApp/tailwind.input.css` to `MyApp/wwwroot/css/app.css`.

### Environment Variables

- `KAMAL_DEPLOY_HOST` - Production hostname for deployment

### Background Jobs

Configured in [Configure.BackgroundJobs.cs](MyApp/Configure.BackgroundJobs.cs) using `BackgroundsJobFeature`. Jobs are commands that implement `IAsyncCommand<T>`.

## Development Workflow

1. **Start dev servers:** `dotnet watch` (starts both .NET and Vite)
2. **Make backend changes:** Edit C# files in `MyApp.ServiceModel` or `MyApp.ServiceInterface`
3. **Restart .NET Server**
4. **Regenerate DTOs:** `cd MyApp.Client && npm run dtos`
5. **Make frontend changes:** Edit Angular files in `MyApp.Client/src`
6. **Add new CRUD feature:**
   - `npx okai init Feature`
   - Edit `MyApp.ServiceModel/Feature.d.ts`
   - `npx okai Feature.d.ts`
   - `npm run migrate`

Docs: [AutoQuery Dev Worfklow](https://react-templates.net/docs/autoquery/dev-workflow)

## Admin Features

- `/admin-ui` - ServiceStack Admin UI (database, users, API explorer)
- `/admin-ui/users` - User management (requires Admin role)
- `/up` - Health check endpoint

## Deployment

GitHub Actions workflows in `.github/workflows/` uses [Kamal for Deployments](https://react-templates.net/docs/deployments):
- `build.yml` - CI build and test
- `build-container.yml` - Docker image build
- `release.yml` - Kamal deployment to production

Configure `KAMAL_DEPLOY_HOST` in GitHub secrets for your hostname. Kamal config in `config/deploy.yml` derives service names from repository name.

## Live Demo

Template demo available at: https://angular-spa.web-templates.io
