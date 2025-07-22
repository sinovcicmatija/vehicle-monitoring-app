using System.Text.Json;

namespace vehicle_api.External.VinDecoder
{
    public class VinApiField
    {
        public string? Label { get; set; }

        public JsonElement value { get; set; }
    }
}
