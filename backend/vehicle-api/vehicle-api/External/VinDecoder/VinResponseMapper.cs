using System.Text.Json;
using vehicle_api.Models;

namespace vehicle_api.External.VinDecoder
{
    public class VinResponseMapper
    {
        public Car MapVinApiResponseToCar(List<VinApiField> fields)
        {
            var car = new Car();

            foreach (var field in fields)
            {
                switch (field.Label)
                {
                    case "VIN":
                        car.Vin = field.value.GetString();
                        break;
                    case "Make":
                        car.Brand = field.value.GetString();
                        break;
                    case "Model":
                        car.Model = field.value.GetString();
                        break;
                    case "Model Year":
                        if (field.value.TryGetInt16(out var makeYear))
                            car.MakeYear = makeYear;
                        break;
                    case "Fuel Type - Primary":
                        car.EngineType = field.value.GetString();
                        break;
                    case "Body":
                        car.Body = field.value.GetString();
                        break;
                    case "Length (mm)":
                        if (field.value.TryGetInt16(out var length))
                            car.LengthMm = length;
                        break;
                    case "Width (mm)":
                        if (field.value.TryGetInt16(out var width))
                            car.WidthMm = width;
                        break;
                    case "Height (mm)":
                        if (field.value.TryGetInt16(out var height))
                            car.HeightMm = height;
                        break;
                    case "Weight Empty (kg)":
                        if (field.value.TryGetInt16(out var emptyWeight))
                            car.WeightEmptyKg = emptyWeight;
                        break;
                    case "Max Weight (kg)":
                        if (field.value.TryGetInt16(out var maxWeight))
                            car.MaxWeightKg = maxWeight;
                        break;
                    case "Max roof load (kg)":
                        if (field.value.TryGetInt16(out var roofLoad))
                            car.MaxRoofLoadKg = roofLoad;
                        break;
                    case "Front Brakes":
                        car.FrontBrakes = field.value.GetString();
                        break;
                    case "Rear Brakes":
                        car.RearBrakes = field.value.GetString();
                        break;
                    case "Wheel Size":
                        car.WheelSize = field.value.GetString();
                        break;
                    case "Emission Standard":
                        car.EmissionStandard = field.value.GetString();
                        break;
                    case "Max Speed (km/h)":
                        if (field.value.TryGetInt16(out var maxSpeed))
                            car.MaxSpeedKmh = maxSpeed;
                        break;
                    case "ABS":
                        if (field.value.ValueKind == JsonValueKind.Number && field.value.GetInt32() == 1)
                            car.ABSState = true;
                        else
                            car.ABSState = false;
                        break;

                }

            }
            return car;
        }

    }
}