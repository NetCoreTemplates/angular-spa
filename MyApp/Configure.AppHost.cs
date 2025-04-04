using MyApp.ServiceInterface;
using ServiceStack.NativeTypes.TypeScript;

[assembly: HostingStartup(typeof(MyApp.AppHost))]

namespace MyApp;

public class AppHost() : AppHostBase("MyApp"), IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            // Configure ASP.NET Core IOC Dependencies
            services.AddSingleton(new AppConfig {
                AppBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "https://localhost:4200"  
                    : null,
                ApiBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "https://localhost:5001"  
                    : null,
            });
        });

    // Configure your AppHost with the necessary configuration and dependencies your App needs
    public override void Configure()
    {
        TypeScriptGenerator.InsertTsNoCheck = true;

        SetConfig(new HostConfig {
        });
    }
    
    // TODO: Replace with your own License Key. FREE Individual or OSS License available from: https://servicestack.net/free
    public static void RegisterKey() =>
        ServiceStack.Licensing.RegisterLicense("OSS BSD-3-Clause 2025 https://github.com/NetCoreTemplates/angular-spa TbFmGhw5yQtjoWXN8KVfWVKJj5QZK/CBYQp9UhzxzCNk6YMz7yRgWJmxh9RZKEUGbErVap4bHZOkXhEtzftc/TE+Hb+RqCzbGcAXd4oR2W9AjSh37ycPJOQK2TtdNaIIOksYqXrlYtu1lIo6sQXBfZ53tYk9gQO5SVsxI9hzJhI=");
}
