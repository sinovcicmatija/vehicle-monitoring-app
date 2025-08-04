using Microsoft.EntityFrameworkCore;
using vehicle_api.Data;
using vehicle_api.Service;
using vehicle_api.Interface;
using vehicle_api.External.VinDecoder;
using DotNetEnv;
using vehicle_api.External.MQTTCommunication;
using MQTTnet.AspNetCore;
using vehicle_api.Utils;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load(@"C:\Users\matek\Desktop\.env");

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3001", "https://localhost:3001")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                      });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient<VinDecoderApiService>(client =>
{
    client.BaseAddress = new Uri("https://api.vindecoder.eu/3.2/");
});

builder.Services.AddSignalR();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<MailSetup>();
builder.Services.AddScoped<MailService>();
builder.Services.AddScoped<ICarService, CarService>();
builder.Services.AddSingleton<MQTTHandler>();
builder.Services.AddHostedService<MQTTStartupService>();
builder.Services.AddHostedService<MailReminderService>();

builder.Services.AddDbContext<VehicleDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<VehicleDbContext>();

    if (!dbContext.Database.CanConnect())
    {
        Console.WriteLine("Baza nije dostupna u trenutku starta.");
    }
}

app.MapHub<CarDataHub>("/hubs/cardata");


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
