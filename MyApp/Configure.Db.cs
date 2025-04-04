using Microsoft.EntityFrameworkCore;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using MyApp.Data;

[assembly: HostingStartup(typeof(MyApp.ConfigureDb))]

namespace MyApp;

public class ConfigureDb : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            var connectionString = context.Configuration.GetConnectionString("DefaultConnection")
                ?? "DataSource=App_Data/app.db;Cache=Shared";
            
            services.AddSingleton<IDbConnectionFactory>(new OrmLiteConnectionFactory(
                connectionString, SqliteDialect.Provider));

            // $ dotnet ef migrations add CreateIdentitySchema
            // $ dotnet ef database update
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(connectionString, b => b.MigrationsAssembly(nameof(MyApp))));
            
            // Enable built-in Database Admin UI at /admin-ui/database
            services.AddPlugin(new AdminDatabaseFeature());
        });
}