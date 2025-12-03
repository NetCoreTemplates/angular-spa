using ServiceStack;
using MyApp.ServiceModel;
using ServiceStack.OrmLite;

namespace MyApp.ServiceInterface;

public class MyServices : Service
{
    public object Any(Hello request)
    {
        return new HelloResponse { Result = $"Hello, {request.Name}!" };
    }
    
    static readonly string[] summaries = [
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    ];

    public object Any(GetWeatherForecast request)
    {
        var rng = new Random();
        return Enumerable.Range(1, 5).Select(index => new Forecast(
            Date: (request.Date ?? DateOnly.FromDateTime(DateTime.Now)).AddDays(index),
            TemperatureC: rng.Next(-20, 55),
            Summary: summaries[rng.Next(summaries.Length)]
        )).ToArray();
    }
}
