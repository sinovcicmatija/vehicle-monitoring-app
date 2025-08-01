import { useEffect, useState } from "react";
import { ConnectUserAndVehicle, GetCarServiceHistory, GetFollowedCars, RemoveConnectionBetweenUserAndVehicle } from "../../services/carService";
import type { ServiceHistoryDTO } from "../Util/serviceHistoryDTO";
import type { FollowedCarsDTO } from "../Util/followedCarsDTO";

const ServiceHistory = ({ }) => {
    const [serviceData, setServiceData] = useState<ServiceHistoryDTO[]>();
    const [followedCars, setFollowedCars] = useState<FollowedCarsDTO[]>([]);
    const [selectedCarVin, setSelectedCarVin] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingButton1, setIsLoadingButton1] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoadingButton2, setIsLoadingButton2] = useState(false);
    const connectedUser = sessionStorage.getItem("user");
    const user = connectedUser ? JSON.parse(connectedUser) : null;
    const username = user?.username;
    const connectedCar = sessionStorage.getItem("connectedCar");

    const loadData = async () => {
        setIsLoading(true);

        if (connectedCar) {
            const car = JSON.parse(connectedCar);
            const vin = car.vin;
            setSelectedCarVin(vin);
            const history = await GetCarServiceHistory(vin);
            setServiceData(history);
        } else if (username) {
            const followed = await GetFollowedCars(username);
            setFollowedCars(followed);

            if (followed.length === 1) {
                const vin = followed[0].vin;
                setSelectedCarVin(vin);
                const history = await GetCarServiceHistory(vin);
                setServiceData(history);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const checkFollowStatus = async () => {
        if (!username || !selectedCarVin) return;

        try {
            const followed = await GetFollowedCars(username);
            setFollowedCars(followed);
            const isCurrentlyFollowed = followed.some(c => c.vin === selectedCarVin);
            setIsFollowing(isCurrentlyFollowed);
        } catch (error) {
            console.error("Greška kod provjere praćenja vozila:", error);
        }
    };

    useEffect(() => {
        checkFollowStatus();
    }, [selectedCarVin]);

    const handleCarSelect = async (vin: string) => {
        setSelectedCarVin(vin);
        const history = await GetCarServiceHistory(vin);
        setServiceData(history);
    };

    if (isLoading) return <p className="p-10">Učitavanje...</p>;

    if (!selectedCarVin && followedCars.length === 0)
        return <p className="p-10">Molimo spojite se na vozilo kako biste pregledali servisnu povijest.</p>;

    const handleAddUserAndCar = async () => {
        setIsLoadingButton1(true);
        const car = JSON.parse(connectedCar!);
        await ConnectUserAndVehicle(username, car.vin);
        await checkFollowStatus();
        setIsLoadingButton1(false);
    };

    const handleDisconnectUserAndCar = async () => {
        setIsLoadingButton1(true);
        await RemoveConnectionBetweenUserAndVehicle(username, selectedCarVin!);
        await checkFollowStatus();
        setServiceData(undefined);
        setSelectedCarVin(null);
        await loadData();
        setIsLoadingButton1(false);
    };


    const handleAddNewServiceEvent = async () => {
        setIsLoadingButton2(true);
    }

    return (
        <div className="p-10">
            {followedCars.length > 1 && (
                <select
                    onChange={(e) => handleCarSelect(e.target.value)}
                    className="mb-4 p-2 border rounded"
                    defaultValue={selectedCarVin || ""}
                >
                    <option value="" disabled>Odaberite vozilo</option>
                    {followedCars.map(car => (
                        <option key={car.vin} value={car.vin}>
                            {car.brand} {car.model} ({car.makeYear}) - {car.vin}
                        </option>
                    ))}
                </select>
            )}

            <h1 className="text-2xl mb-2">Servisna povijest</h1>

            {/* Prikaži ime vozila ako samo jedno ili je odabrano */}
            {selectedCarVin && followedCars.length > 0 && (
                <p className="mb-4 text-gray-600">
                    Vozilo: {
                        followedCars.find(c => c.vin === selectedCarVin)
                            ? `${followedCars.find(c => c.vin === selectedCarVin)!.brand} ${followedCars.find(c => c.vin === selectedCarVin)!.model} (${followedCars.find(c => c.vin === selectedCarVin)!.makeYear}) - ${selectedCarVin}`
                            : selectedCarVin
                    }
                </p>
            )}

            {/* Kada nema servisa */}
            {serviceData && serviceData.length === 0 && (
                <p>Za odabrano vozilo ne postoji evidentirana servisna povijest.</p>
            )}

            {/* Kada ima servisa */}
            {serviceData && serviceData.length > 0 && (
                <ul className="space-y-4 mb-6">
                    {serviceData.map((entry, index) => (
                        <li key={index} className="border p-4 rounded shadow">
                            <p><strong>Datum:</strong> {entry.performedDate}</p>
                            <p><strong>Kilometraža:</strong> {entry.mileageAtService} km</p>
                            <p><strong>Napomena:</strong> {entry.notes || "-"}</p>
                            <p><strong>Servisi:</strong> {entry.performedServices?.join(", ") || "Nema podataka"}</p>
                        </li>
                    ))}
                </ul>
            )}

            {/* Gumbovi prikazani uvijek kada je odabrano vozilo */}
            {selectedCarVin && (
                <div className="flex flex-row p-5 gap-2">
                    {isFollowing ? (
                        <button className="bg-primary hover:bg-blue-700 px-6 py-2 rounded-lg text-white shadow-lg"
                            onClick={handleDisconnectUserAndCar}>
                            {isLoadingButton1 ? "Učitavanje..." : "Prestani pratiti servise za ovo vozilo"}
                        </button>
                    ) : (
                        <button className="bg-primary hover:bg-blue-700 px-6 py-2 rounded-lg text-white shadow-lg"
                            onClick={handleAddUserAndCar}>
                            {isLoadingButton1 ? "Učitavanje..." : "Prati servise za ovo vozilo"}
                        </button>
                    )}

                    <button className="bg-primary hover:bg-blue-700 px-6 py-2 rounded-lg text-white shadow-lg"
                        onClick={handleAddNewServiceEvent}>
                        {isLoadingButton2 ? "Učitavanje..." : "Dodaj novi servis"}
                    </button>
                </div>
            )}
        </div>
    );


};

export default ServiceHistory;