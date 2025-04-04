using ServiceStack;

namespace MyApp.ServiceModel;

[Route("/confirm-email")]
public class ConfirmEmail : IGet, IReturnVoid
{
    public required string UserId { get; set; }
    public required string Code { get; set; }
    public string? ReturnUrl { get; set; }
}
