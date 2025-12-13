using Microsoft.AspNetCore.Identity;

namespace MyApp.Data;

/* After modifying ApplicationUser, delete and recreate the initial EF Core migration with:
   rm Migrations/202*.cs Migrations/ApplicationDbContextModelSnapshot.cs
   dotnet ef migrations add CreateIdentitySchema
*/

// Add profile data for application users by adding properties to the ApplicationUser class
public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? ProfileUrl { get; set; }
}
