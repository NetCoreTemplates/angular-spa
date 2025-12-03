using ServiceStack.AI;

[assembly: HostingStartup(typeof(MyApp.ConfigureAiChat))]

namespace MyApp;

public class ConfigureAiChat : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {

            // Docs: https://docs.servicestack.net/ai-chat-api
            services.AddPlugin(new ChatFeature {
                EnableProviders = [
                    "servicestack",
                    // "groq",
                    // "google_free",
                    // "openrouter_free",
                    // "ollama",
                    // "google",
                    // "anthropic",
                    // "openai",
                    // "grok",
                    // "qwen",
                    // "z.ai",
                    // "mistral",
                    // "openrouter",
                ]
            });

            // Persist AI Chat History, enables analytics at /admin-ui/chat
            services.AddSingleton<IChatStore, DbChatStore>();
            // Or store history in monthly partitioned tables in PostgreSQL:
            // services.AddSingleton<IChatStore, PostgresChatStore>();
            
            // Add AI Chat link to /metadata
            services.ConfigurePlugin<MetadataFeature>(feature => {
                feature.AddPluginLink("/chat", "AI Chat");
            });
        });
}