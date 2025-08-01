import { useEffect, useState } from "react";
import type { LoggedInUserDTO } from "../Util/loggedInUserDTO";
import { getCarData } from "../../services/carService";
import type { CarDataDTO } from "../Util/carDataDTO";
import { fetchCarImage } from "../Util/fetchCarImage";

const Home = ({ loggedInUser }: { loggedInUser: LoggedInUserDTO }) => {
    const [data, setData] = useState<CarDataDTO | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [carImage, setCarImage] = useState<string | null>(null);

    useEffect(() => {
        if (data?.brand && data?.model) {
            const fullName = `${data.brand} ${data.model}`;
            fetchCarImage(fullName).then(setCarImage);
        }
    }, [data]);

    useEffect(() => {
        const savedCar = sessionStorage.getItem("connectedCar");
        if (savedCar) {
            setData(JSON.parse(savedCar));
        }
    }, []);

    const handleClick = async () => {
        setIsLoading(true);
        const data = await getCarData();
        setData(data);
        sessionStorage.setItem("connectedCar", JSON.stringify(data));
        setIsLoading(false);
    };

    const handleDisconnect = () => {
        setData(null);
        sessionStorage.removeItem("connectedCar");
    };

    return (
        <>
            <h1 className="font-semibold m-3 text-xl">
                Dobrodošli natrag, {loggedInUser.username}
            </h1>

            <div className="flex flex-row">
                {!data && (
                    <button className="bg-primary hover:bg-blue-700 px-6 py-2 rounded-lg text-white shadow-lg" onClick={handleClick} disabled={isLoading}>
                        {isLoading ? "Učitavanje..." : "Povezivanje na vozilo"}
                    </button>
                )}

                {data && (
                    <>

                        <div className="flex-1">
                            <button className="bg-primary hover:bg-blue-700 px-6 py-2 rounded-lg text-white shadow-lg mb-8 " onClick={handleDisconnect}>
                                Prekini vezu
                            </button>

                            <div className="grid gird-cols-1 md:grid-cols-2 gap-8 md:max-w-[1200px] ">

                                {carImage && (
                                    <img
                                        src={carImage}
                                        alt={`${data.brand} ${data.model}`}
                                        className="w-[300px] h-auto md:w-[400px] rounded-lg shadow-md mb-4"
                                    />
                                )}

                                {/* OSNOVNE INFORMACIJE */}
                                <section className="shadow-lg border-l-4 p-10 rounded-lg bg-white">
                                    <h2 className="font-bold text-lg mb-2">Osnovne informacije</h2>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>Marka i model: {data.brand} {data.model}</div>
                                        <div>Godina proizvodnje: {data.makeYear}</div>
                                        <div>Tip motora: {data.engineType}</div>
                                        <div>Broj šasije: {data.vin}</div>
                                        <div>Emisijski standard: {data.emissionStandard}</div>
                                        <div>Maksimalna brzina: {data.maxSpeedKmh} km/h</div>
                                    </div>
                                </section>

                                {/* DIMENZIJE I KAROSERIJA */}
                                <section className="shadow-lg border-l-4 p-10 rounded-lg bg-white">
                                    <h2 className="font-bold text-lg mb-2">Dimenzije i karoserija</h2>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>Oblik karoserije: {data.body}</div>
                                        <div>Dužina: {data.lengthMm} mm</div>
                                        <div>Širina: {data.widthMm} mm</div>
                                        <div>Visina: {data.heightMm} mm</div>
                                    </div>
                                </section>

                                {/* TEŽINE */}
                                <section className="shadow-lg border-l-4 p-10 rounded-lg bg-white">
                                    <h2 className="font-bold text-lg mb-2">Masa i nosivost</h2>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>Težina praznog vozila: {data.weightEmptyKg} kg</div>
                                        <div>Maksimalna težina: {data.maxWeightKg} kg</div>
                                        <div>Maks. teret na krovu: {data.maxRoofLoadKg} kg</div>
                                    </div>
                                </section>

                                {/* KOČNICE I OVJES */}
                                <section className="shadow-lg border-l-4 p-10 rounded-lg bg-white">
                                    <h2 className="font-bold text-lg mb-2">Kočnice i ovjes</h2>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>Prednje kočnice: {data.frontBrakes}</div>
                                        <div>Stražnje kočnice: {data.rearBrakes}</div>
                                        <div>Veličina kotača: {data.wheelSize}</div>
                                        <div>ABS: {data.absState ? "Da" : "Ne"}</div>
                                    </div>
                                </section>

                            </div>
                        </div>
                    </>
                )}

            </div>
        </>
    );
};

export default Home;
