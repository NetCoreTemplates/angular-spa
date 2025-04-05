using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using MyApp.Data;
using MyApp.ServiceModel;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Text;
using ServiceStack.FluentValidation;

namespace MyApp.ServiceInterface;

public class IdentityRegistrationValidator : AbstractValidator<Register>
{
    public IdentityRegistrationValidator()
    {
        RuleSet(ApplyTo.Post, () =>
        {
            RuleFor(x => x.Password).NotEmpty();
            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password)
                .When(x => x.ConfirmPassword != null)
                .WithErrorCode(nameof(ErrorMessages.PasswordsShouldMatch))
                .WithMessage(ErrorMessages.PasswordsShouldMatch.Localize(base.Request));
            RuleFor(x => x.UserName).NotEmpty().When(x => x.Email.IsNullOrEmpty());
            RuleFor(x => x.Email).NotEmpty().EmailAddress().When(x => x.UserName.IsNullOrEmpty());
            RuleFor(x => x.UserName)
                .MustAsync(async (x, token) =>
                {
                    var userManager = Request.TryResolve<UserManager<ApplicationUser>>();
                    return await userManager.FindByEmailAsync(x).ConfigAwait() == null;
                })
                .WithErrorCode("AlreadyExists")
                .WithMessage(ErrorMessages.UsernameAlreadyExists.Localize(base.Request))
                .When(x => !x.UserName.IsNullOrEmpty());
            RuleFor(x => x.Email)
                .MustAsync(async (x, token) =>
                {
                    var userManager = Request.TryResolve<UserManager<ApplicationUser>>();
                    return await userManager.FindByEmailAsync(x).ConfigAwait() == null;
                })
                .WithErrorCode("AlreadyExists")
                .WithMessage(ErrorMessages.EmailAlreadyExists.Localize(base.Request))
                .When(x => !x.Email.IsNullOrEmpty());
        });
    }
}

public class RegisterService(UserManager<ApplicationUser> userManager, IEmailSender<ApplicationUser> emailSender, AppConfig appConfig)
    : IdentityRegisterServiceBase<ApplicationUser>(userManager)
{
    string AppBaseUrl => appConfig.AppBaseUrl ?? Request.GetBaseUrl();
    string ApiBaseUrl => appConfig.ApiBaseUrl ?? Request.GetBaseUrl();
    private string AppErrorUrl => AppBaseUrl.CombineWith("/error");

    public async Task<object> PostAsync(Register request)
    {
        var emailNotSetup = emailSender is IdentityNoOpEmailSender;
        var authCtx = AuthContext;
        
        var newUser = request.ConvertTo<ApplicationUser>();
        newUser.UserName ??= newUser.Email;
        newUser.Email = request.Email;

        //TODO: Remove to use force email confirmation
        //newUser.EmailConfirmed = emailNotSetup;

        var result = await UserManager.CreateAsync(newUser, request.Password);
        result.AssertSucceeded();

        var session = authCtx.UserToSessionConverter(newUser);
        await RegisterNewUserAsync(session, newUser);

        var userId = await UserManager.GetUserIdAsync(newUser);
        var code = await UserManager.GenerateEmailConfirmationTokenAsync(newUser);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        var callbackUrl = ApiBaseUrl.CombineWith(new ConfirmEmail
        {
            UserId = userId,
            Code = code,
            ReturnUrl = Request.GetReturnUrl()
        }.ToGetUrl());

        await emailSender.SendConfirmationLinkAsync(newUser, newUser.Email, HtmlEncoder.Default.Encode(callbackUrl));

        var response = await CreateRegisterResponse(session,
            request.UserName ?? request.Email, request.Password, request.AutoLogin);
        
        if (response is RegisterResponse registerResponse)
        {
            var signupConfirmUrl = AppBaseUrl.CombineWith("/signup-confirm");
            if (emailNotSetup)
                signupConfirmUrl = signupConfirmUrl.AddQueryParam("confirmLink", callbackUrl);

            registerResponse.RedirectUrl = signupConfirmUrl;
        }
        
        return response;
    }

    public async Task<object> Any(ConfirmEmail request)
    {
        var user = await UserManager.FindByIdAsync(request.UserId);
        if (user == null)
            return HttpResult.Redirect(AppErrorUrl.AddQueryParam("message", "User not found"));

        var code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Code));
        var result = await UserManager.ConfirmEmailAsync(user, code);
        if (!result.Succeeded)
            return HttpResult.Redirect(AppErrorUrl.AddQueryParam("message", "Error confirming your email."));

        return HttpResult.Redirect(AppBaseUrl.CombineWith(request.ReturnUrl ?? "/signin"));
    }
}
