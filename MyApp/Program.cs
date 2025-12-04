using System.Net;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using MyApp.Data;
using MyApp.ServiceInterface;

AppHost.RegisterKey();

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

services.AddAuthorization();
services.AddAuthentication(options =>
    {
        options.DefaultScheme = IdentityConstants.ApplicationScheme;
        options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
    })
    .AddIdentityCookies();
services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo("App_Data"));

services.AddDatabaseDeveloperPageExceptionFilter();

services.AddIdentityCore<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

services.AddRazorPages();

services.AddSingleton<IEmailSender<ApplicationUser>, IdentityNoOpEmailSender>();
// Uncomment to send emails with SMTP, configure SMTP with "SmtpConfig" in appsettings.json
// services.AddSingleton<IEmailSender<ApplicationUser>, EmailSender>();
services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, AdditionalUserClaimsPrincipalFactory>();

// Register all services
services.AddServiceStack(typeof(MyServices).Assembly);

var app = builder.Build();
var nodeProxy = new NodeProxy("http://localhost:4200") {
    Log = app.Logger
};

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseMigrationsEndPoint();
        
    app.MapNotFoundToNode(nodeProxy);
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapCleanUrls();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapRazorPages();

app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
});

// Proxy development HMR WebSocket and fallback routes to the Next server
if (app.Environment.IsDevelopment())
{
    // Start the Angular dev server if it's not running
    bool IsPortAvailable(int port) => System.Net.NetworkInformation.IPGlobalProperties.GetIPGlobalProperties()
            .GetActiveTcpListeners().All(x => x.Port != port);
    if (IsPortAvailable(4200) && nodeProxy.TryStartNode("../MyApp.Client", out var process))
    {
        app.Lifetime.ApplicationStopping.Register(() => {
            if (!process.HasExited)
            {
                nodeProxy.Log.LogDebug("Terminating process: " + process.Id);
                process.Kill(entireProcessTree: true);
            }
        });
    }
    
    app.UseWebSockets();
    app.MapViteHmr(nodeProxy);
    app.MapFallbackToNode(nodeProxy);

    // Wait for Angular Dev Server to start...
    ExecUtils.RetryOnException(() => 
        nodeProxy.Client.GetStringAsync("/").Wait(), timeOut:TimeSpan.FromSeconds(30));
}
else
{
    // Map fallback to index.html in production (MyApp.Client/dist > wwwroot)
    app.MapFallbackToFile("index.html");
}

app.Run();
