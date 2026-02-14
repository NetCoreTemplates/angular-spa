using MyApp.ServiceInterface;
using ServiceStack.NativeTypes.TypeScript;

[assembly: HostingStartup(typeof(MyApp.AppHost))]

namespace MyApp;

public class AppHost() : AppHostBase("MyApp"), IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((Action<WebHostBuilderContext, IServiceCollection>)((context, services) => {
            // Configure ASP.NET Core IOC Dependencies
            services.AddSingleton(context.Configuration.GetSection(nameof(AppConfig))?.Get<AppConfig>()
                ?? new AppConfig {
                        BaseUrl = context.HostingEnvironment.IsDevelopment()
                            ? "https://localhost:5001"  
                            : Environment.GetEnvironmentVariable("KAMAL_DEPLOY_HOST"),
                    });
            }));

    // Configure your AppHost with the necessary configuration and dependencies your App needs
    public override void Configure()
    {
        TypeScriptGenerator.InsertTsNoCheck = true;
        
        SetConfig(new HostConfig {
        });
    }
    
    // TODO: Replace with your own License Key. FREE Individual or OSS License available from: https://servicestack.net/free
    public static void RegisterKey() =>
        ServiceStack.Licensing.RegisterLicense("OSS BSD-3-Clause 2026 https://github.com/ServiceStack/ServiceStack O/YkmuxTrsTH+YGs8I9+/ipPvS5c8YIvTBsxtfB5bzusvWEclq+tyFbI54K152sn5sv2Z2q1IH6JerY0l76YhIxmCyuz5q99my5T2zUNl4IRuFHfO7226sPIOxH6G4+X82k2JHL+O0wJzqrpLN52+z17SZK95tkfdKkx6b+79c4=");
}
