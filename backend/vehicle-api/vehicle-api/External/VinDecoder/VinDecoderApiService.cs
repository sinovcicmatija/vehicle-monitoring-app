using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using vehicle_api.Models;

namespace vehicle_api.External.VinDecoder
{
    public class VinDecoderApiService
    {

        private readonly HttpClient _httpClient;
        private readonly string? _apiKey;
        private readonly string? _secretKey;

        public VinDecoderApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _apiKey = Environment.GetEnvironmentVariable("VINDECODER_API_KEY")
                ?? throw new ArgumentNullException("API key nije pronađen u konfiguraciji.");
            _secretKey = Environment.GetEnvironmentVariable("VINDECODER_SECRET_KEY")
                ?? throw new ArgumentNullException("Secret key nije pronađen u konfiguraciji.");
        }

        public async Task<Car> DecodeVinAsync(string vin)
        {
            var action = "decode";
            var upperVin = vin.ToUpper();

            var raw = $"{upperVin}|{action}|{_apiKey}|{_secretKey}";
            var sha1 = SHA1.HashData(Encoding.UTF8.GetBytes(raw));
            var controlSum = BitConverter.ToString(sha1).Replace("-", "").Substring(0, 10);

            var requestUri = $"{_apiKey}/{controlSum}/{action}/{upperVin}.json";

            var response = await _httpClient.GetAsync(requestUri);
            response.EnsureSuccessStatusCode();

            using var stream = await response.Content.ReadAsStreamAsync();
            var jsonDoc = await JsonDocument.ParseAsync(stream);

            var decodeElement = jsonDoc.RootElement.GetProperty("decode");

            var fields = new List<VinApiField>();
            foreach (var item in decodeElement.EnumerateArray())
            {
                var field = new VinApiField
                {
                    Label = item.GetProperty("label").GetString()!,
                    value = item.GetProperty("value")
                };
                fields.Add(field);
            }

            var mapper = new VinResponseMapper();
            var car = mapper.MapVinApiResponseToCar(fields);

            return car;
        }
    }
}
