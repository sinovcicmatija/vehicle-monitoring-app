using MimeKit;
using MailKit.Net.Smtp;

namespace vehicle_api.Utils
{
    public class MailSetup
    {
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Car Scan Sustav", "sinovcicmatija@gmail.com"));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            message.Body = new TextPart("plain")
            {
                Text = body
            };

            using var client = new SmtpClient();
            await client.ConnectAsync("smtp.gmail.com", 587, false);
            await client.AuthenticateAsync("sinovcicmatija@gmail.com", "rqdzusgidufhgurn"); 
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
