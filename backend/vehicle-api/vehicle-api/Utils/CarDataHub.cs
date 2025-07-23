using Microsoft.AspNetCore.SignalR;
using vehicle_api.Models.DTO;

namespace vehicle_api.Utils
{
    public class CarDataHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Klijent povezan: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Klijent odspojen: {Context.ConnectionId}");
            await base.OnDisconnectedAsync(exception);
        }

    }
}
