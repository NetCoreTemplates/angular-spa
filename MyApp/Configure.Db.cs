using Microsoft.EntityFrameworkCore;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using MyApp.Data;
using Microsoft.EntityFrameworkCore.Diagnostics;

[assembly: HostingStartup(typeof(MyApp.ConfigureDb))]

namespace MyApp;

public class ConfigureDb : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            var connectionString = context.Configuration.GetConnectionString("DefaultConnection")
                                   ?? "DataSource=App_Data/app.db;Cache=Shared";
            
            services.AddOrmLite(options => options.UseSqlite(connectionString));
            // Retry deadlocks, throttling and lost connections on PostgreSQL, SQL Server and MySQL (SQLite isn't retried)
            OrmLiteConfig.RetryPolicy = OrmLiteRetry.Exponential(maxRetries: 3);

            // $ dotnet ef migrations add CreateIdentitySchema
            // $ dotnet ef database update
            services.AddDbContext<ApplicationDbContext>(options => {
                options.UseSqlite(connectionString, b => b.MigrationsAssembly(nameof(MyApp)));
                options.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
            });
            
            // Enable built-in Database Admin UI at /admin-ui/database
            services.AddPlugin(new AdminDatabaseFeature {
                // Log differences between data models and their tables on startup
                LogSchemaDiff = context.HostingEnvironment.IsDevelopment(),
            });
        });
}