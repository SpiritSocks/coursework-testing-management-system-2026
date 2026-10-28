using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Stms_backend.Data;
using Stms_backend.Services;

namespace Stms_backend;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        
        builder.Services.AddControllers();
        
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
        
        builder.Services.AddScoped<IProjectService, ProjectService>();
        
        builder.Services.AddOpenApi();
        
        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference(opt =>
            {
                opt.Title = "Stms API";
                opt.Theme = ScalarTheme.Mars;
                opt.DefaultHttpClient = new(ScalarTarget.Http, ScalarClient.Http11);
            });
        }
        
        app.MapControllers();
        app.Run();
    }
}