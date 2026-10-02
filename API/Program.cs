using Application.Core;
using Application.Interfaces;
using Application.services;
using Application.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers with Global Authorization Filter
builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes(IdentityConstants.ApplicationScheme)
        .RequireAuthenticatedUser()
        .Build();

    opt.Filters.Add(new AuthorizeFilter(policy));
});

// 2. Database Context configuration
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// 3. Identity Setup
builder.Services.AddIdentityApiEndpoints<ApplicationUser>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<ApplicationRole>()
.AddEntityFrameworkStores<AppDbContext>();

// FIX: Tells controllers to validate the Identity Cookie instead of checking for a Bearer token
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
    options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
    options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
});

// 4. Fine-tune Application Cookies for React Integration
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Set to SameAsRequest if strict HTTP locally
    options.Cookie.SameSite = SameSiteMode.None; // Set to Lax if React and API share exact same domain/port
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
    options.SlidingExpiration = true;
});

// 5. Cross-Origin Resource Sharing (CORS) Configuration
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:3001", "https://localhost:3001", "https://localhost:5001")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // Essential for passing cookies
    });
});

// 6. Application Dependency Injections
builder.Services.AddTransient<ICommentsService, CommentsService>();
builder.Services.AddTransient<ICategoryService, CategoriesService>();
builder.Services.AddTransient<IGrantService, GrantService>();
builder.Services.AddTransient<IInitiativeService, InitiativesService>();
builder.Services.AddTransient<IBudgetService, BudgetService>();
builder.Services.AddTransient<IReproService, ReproService>();
builder.Services.AddTransient<IDisbService, DisbService>();
builder.Services.AddTransient<IReportParameterValuesService, ReportParameterValuesService>();
builder.Services.AddTransient<IReportService, ReportService>();
builder.Services.AddTransient<DisbService, DisbService>();


builder.Services.AddTransient<IReportRunnerService, ReportRunnerService>((provider) =>
{
    return new ReportRunnerService(
        builder.Configuration.GetValue<string>("ReportServerUserName")!,
        builder.Configuration.GetValue<string>("ReportServerPassword")!,
        builder.Configuration.GetValue<string>("ReportServerIp")!,
        builder.Configuration.GetValue<string>("ReportServerUrl")!,
        builder.Configuration.GetValue<string>("ReportServerFolder")!
    );
});

builder.Services.AddTransient<VendorService, VendorService>();

builder.Services.AddAutoMapper((c) =>
{
    c.AddProfile<MappingProfiles>();
});



var app = builder.Build();

// 7. Request Pipeline Routing Middleware
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

// Maps Identity to /api/login, /api/register, and /api/manage/info
// app.MapGroup("api").MapIdentityApi<ApplicationUser>();

app.MapFallbackToController("Index", "Fallback");

// 8. DB Migration & Initial Seeding Configuration
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<AppDbContext>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();

    await context.Database.MigrateAsync();

    // Seed Admin Role
    var role = await roleManager.FindByNameAsync("ADMIN");
    if (role == null)
    {
        await roleManager.CreateAsync(new ApplicationRole() { Name = "Admin", NormalizedName = "ADMIN" });
    }

    // Seed User Role
    var userRole = await userManager.FindByNameAsync("USER");
    if (userRole == null)
    {
        await roleManager.CreateAsync(new ApplicationRole() { Name = "User", NormalizedName = "USER" });
    }

    // Seed Default Administrator User
    var adminEmail = builder.Configuration.GetValue<string>("AdminEmail")!;
    var user1 = await userManager.FindByEmailAsync(adminEmail);

    if (user1 == null)
    {
        var result = await userManager.CreateAsync(new ApplicationUser
        {
            FirstName = "Hector",
            LastName = "Alfonso",
            UserName = adminEmail,
            NormalizedEmail = adminEmail.ToUpper(),
            Email = adminEmail,
        }, "Password#1");

        if (!result.Succeeded)
        {
            throw new Exception("Could not create seeding user");
        }
    }
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during database migration or seeding.");
}

app.Run();
