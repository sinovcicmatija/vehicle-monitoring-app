import { useEffect, useState } from "react";
import { GetServiceTypes } from "../../services/carService";
import { useNavigate, useLocation } from "react-router-dom";
import { SaveCarServiceEvent } from "../../services/carService";

const AddServiceEvent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const vin = location.state?.vin;

    const [performedDate, setPerformedDate] = useState("");
    const [mileageAtService, setMileageAtService] = useState<number | "">("");
    const [notes, setNotes] = useState("");
    const [serviceTypes, setServiceTypes] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredServices = serviceTypes.filter(service =>
        service.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".relative")) setDropdownOpen(false);
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const types = await GetServiceTypes();
                setServiceTypes(types);
            } catch (err) {
                setError("Greška prilikom dohvaćanja tipova servisa.");
            }
        };
        fetchServiceTypes();
    }, []);

    const toggleService = (service: string) => {
        setSelectedServices(prev =>
            prev.includes(service)
                ? prev.filter(s => s !== service)
                : [...prev, service]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!vin || !performedDate || !mileageAtService || selectedServices.length === 0) {
            setError("Molimo ispunite sva obavezna polja i odaberite bar jedan servis.");
            return;
        }

        try {
            setIsLoading(true);
            await SaveCarServiceEvent({
                vin,
                performedDate,
                mileageAtService: Number(mileageAtService),
                notes,
                performedServices: selectedServices
            });
            navigate("/history", {state: { vin }});
        } catch (err) {
            setError("Došlo je do greške prilikom spremanja servisa.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-10 max-w-2xl mx-auto">
            <h1 className="text-2xl mb-4">Dodaj novi servis</h1>

            {error && <p className="text-red mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Datum izvođenja servisa*</label>
                    <input type="date" className="border p-2 rounded w-full" value={performedDate} onChange={e => setPerformedDate(e.target.value)} />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Kilometraža prilikom servisa*</label>
                    <input type="number" className="border p-2 rounded w-full" value={mileageAtService} onChange={e => setMileageAtService(Number(e.target.value))} />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Napomena (opcionalno)</label>
                    <textarea className="border p-2 rounded w-full" value={notes} onChange={e => setNotes(e.target.value)} />
                </div>

                <div className="relative">
                    <label className="block mb-1 font-medium">Obavljeni servisi*</label>

                    <div
                        className="border rounded p-2 cursor-pointer w-full bg-white"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {selectedServices.length > 0
                            ? selectedServices.join(", ")
                            : "Odaberite servise"}
                    </div>

                    {dropdownOpen && (
                        <div className="absolute z-10 mt-1 border bg-white w-full rounded shadow max-h-60 overflow-y-auto">
                            <input
                                type="text"
                                placeholder="Pretraži..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full border-b px-2 py-1 outline-none"
                            />

                            {filteredServices.length === 0 ? (
                                <div className="p-2 text-gray-500 text-sm">Nema rezultata</div>
                            ) : (
                                filteredServices.map(service => (
                                    <label
                                        key={service}
                                        className={`flex items-center px-2 py-1 hover:bg-blue-100 cursor-pointer ${selectedServices.includes(service) ? "bg-blue-50 font-semibold" : ""
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedServices.includes(service)}
                                            onChange={() => toggleService(service)}
                                            className="mr-2"
                                        />
                                        {service}
                                    </label>
                                ))
                            )}
                        </div>
                    )}
                </div>


                <div className="flex gap-4">
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded shadow-lg hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? "Spremanje..." : "Spremi servis"}
                    </button>
                    <button type="button" className="bg-gray-300 px-6 py-2 rounded" onClick={() => navigate(-1)}>Natrag</button>
                </div>
            </form>
        </div>
    );
};

export default AddServiceEvent;
