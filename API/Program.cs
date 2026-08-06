using Application.Interfaces;
using Application.services;
using Application.Services;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi



builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddTransient<ICommentsService, CommentsService>();
builder.Services.AddTransient<ICategoryService, CategoriesService>();
builder.Services.AddTransient<IGrantService, GrantService>();
builder.Services.AddTransient<IInitiativeService, InitiativesService>();
builder.Services.AddTransient<IBudgetService, BudgetService>();


builder.Services.AddControllers();
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



var app = builder.Build();

// Configure the HTTP request pipeline.


app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.MapControllers();


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

