using Application.Interfaces;
using Application.services;
using Application.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});


builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentityApiEndpoints<ApplicationUser>(opt =>
{
    opt.User.RequireUniqueEmail = true;
    // opt.SignIn.RequireConfirmedEmail = true;
})
.AddRoles<ApplicationRole>()
.AddEntityFrameworkStores<AppDbContext>();


builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.Cookie.SameSite = SameSiteMode.None; // or None if using HTTPS locally
});

builder.Services.AddAuthorization();
builder.Services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .WithOrigins("http://localhost:3001", "https://localhost:3001", "https://localhost:5001");
                });
            });


builder.Services.AddTransient<ICommentsService, CommentsService>();
builder.Services.AddTransient<ICategoryService, CategoriesService>();
builder.Services.AddTransient<IGrantService, GrantService>();
builder.Services.AddTransient<IInitiativeService, InitiativesService>();
builder.Services.AddTransient<IBudgetService, BudgetService>();
builder.Services.AddTransient<IReproService, ReproService>();
builder.Services.AddTransient<IDisbService, DisbService>();
builder.Services.AddTransient<IReportParameterValuesService, ReportParameterValuesService>();
builder.Services.AddTransient<IReportService, ReportService>();

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




var app = builder.Build();

// Configure the HTTP request pipeline.

// app.UseHttpsRedirection();
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();


app.MapControllers();
app.MapGroup("api").MapIdentityApi<ApplicationUser>();
app.MapFallbackToController("Index", "Fallback");


using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<AppDbContext>();
    // var userManager = services.GetRequiredService<UserManager<User>>();
    await context.Database.MigrateAsync();
    // await DbInitializer.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "migration error");
}


app.Run();

