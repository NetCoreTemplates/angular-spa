using ServiceStack;

[assembly: HostingStartup(typeof(MyApp.ConfigureGeneratedDtos))]

namespace MyApp;

public class ConfigureGeneratedDtos : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(afterAppHostInit: appHost =>
        {
            StartupTasks.Register("dtos", () =>
                appHost.GetPlugin<NativeTypesFeature>().GenerateDtos(new GenerateDtosOptions
                {
                    Directory = appHost.MapProjectPath("~/../MyApp.Client"),
                }));
        });
}
