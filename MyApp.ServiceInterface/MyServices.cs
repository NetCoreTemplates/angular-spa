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

    public async Task<object> Any(AdminData request)
    {
        var tables = new (string Label, Type Type)[] 
        {
            ("Bookings", typeof(Booking)),
            ("Coupons",  typeof(Coupon)),
        };
        var dialect = Db.GetDialectProvider();
        var totalSql = tables.Map(x => $"SELECT '{x.Label}', COUNT(*) FROM {dialect.GetQuotedTableName(x.Type.GetModelMetadata())}")
            .Join(" UNION ");
        var results = await Db.DictionaryAsync<string,int>(totalSql);
        
        return new AdminDataResponse {
            PageStats = tables.Map(x => new PageStats {
                Label = x.Label, 
                Total = results[x.Label],
            })
        };
    }
}
