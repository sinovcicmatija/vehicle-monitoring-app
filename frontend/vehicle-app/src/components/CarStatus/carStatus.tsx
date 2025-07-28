import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { GiCartwheel } from "react-icons/gi";
import { GiCarSeat } from "react-icons/gi";
import { MdElectricBolt } from "react-icons/md";
import { getDtc } from "../../services/carService";

const CarStatus = ({ }) => {
    const [dtc, setDtc] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasScanned, setHasScanned] = useState(true);
    const [expanded, setExpanded] = useState({
        P: false,
        C: false,
        B: false,
        U: false
    });
    const [groupedDtc, setGroupedDtc] = useState({
        P: [] as string[],
        C: [] as string[],
        B: [] as string[],
        U: [] as string[],
    });

    const toggle = (type: keyof typeof expanded) => {
        setExpanded(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const startDiagnostics = async () => {
        setIsLoading(true);
        const dtc = await getDtc();

        if (dtc.length === 0) {
            setDtc([]);
            setGroupedDtc({ P: [], C: [], B: [], U: [] });
            setIsLoading(false);
            return;
        }

        dtc.forEach(code => {
            const type = code.charAt(0) as keyof typeof groupedDtc;
            if (groupedDtc[type]) {
                groupedDtc[type].push(code);
            }
        });

        setGroupedDtc(groupedDtc);
        setDtc(dtc);
        setHasScanned(true);
        setIsLoading(false);
    };

    return (
        <>
            {!hasScanned && (

                <button className="bg-primary hover:bg-blue-700 px-6 py-2 rounded-lg text-white shadow-lg" onClick={startDiagnostics}>{isLoading ? "Početak..." : "Dijagnostika auta"}</button>
            )}

            {hasScanned && (
                <>
                    <div onClick={() => toggle("P")}>
                        <div className="dtc-card">
                            <div className="flex items-center space-x-2">
                                <FaScrewdriverWrench />
                                <h1>Pogon</h1>
                            </div>
                            {groupedDtc.P.length === 0 ? (
                                <FaCheck className="text-lime-500" />
                            ) : (
                                <span className="text-red-500">{groupedDtc.P.length} grešaka</span>
                            )}
                        </div>
                        {expanded.P && (
                            groupedDtc.P.length > 0 ? (
                                <ul className="ml-6 mt-2 list-disc">
                                    {groupedDtc.P.map(code => (
                                        <li key={code}>{code}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="ml-6 mt-2 mb-5 text-green-600">Nema aktivnih grešaka</p>
                            )
                        )}
                    </div>

                    <div onClick={() => toggle("C")}>
                        <div className="dtc-card">
                            <div className="flex items-center space-x-2">
                                <GiCartwheel />
                                <h1>Ovjes i upravljanje</h1>
                            </div>
                            {groupedDtc.C.length === 0 ? (
                                <FaCheck className="text-lime-500" />
                            ) : (
                                <span className="text-red-500">{groupedDtc.C.length} grešaka</span>
                            )}
                        </div>
                        {expanded.C && (
                            groupedDtc.C.length > 0 ? (
                                <ul className="ml-6 mt-2 list-disc">
                                    {groupedDtc.C.map(code => (
                                        <li key={code}>{code}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="ml-6 mt-2 mb-5 text-green-600">Nema aktivnih grešaka</p>
                            )
                        )}
                    </div>
                    <div onClick={() => toggle("B")}>
                        <div className="dtc-card">
                            <div className="flex items-center space-x-2">
                                <GiCarSeat />
                                <h1>Unutrašnjost i oprema</h1>
                            </div>
                            {groupedDtc.B.length === 0 ? (
                                <FaCheck className="text-lime-500" />
                            ) : (
                                <span className="text-red-500">{groupedDtc.B.length} grešaka</span>
                            )}
                        </div>
                        {expanded.B && (
                            groupedDtc.B.length > 0 ? (
                                <ul className="ml-6 mt-2 list-disc">
                                    {groupedDtc.B.map(code => (
                                        <li key={code}>{code}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="ml-6 mt-2 mb-5 text-green-600">Nema aktivnih grešaka</p>
                            )
                        )}
                    </div>
                    <div onClick={() => toggle("U")}>
                        <div className="dtc-card">
                            <div className="flex items-center space-x-2">
                                <MdElectricBolt />
                                <h1>Elektronika vozila</h1>
                            </div>
                            {groupedDtc.U.length === 0 ? (
                                <FaCheck className="text-lime-500" />
                            ) : (
                                <span className="text-red-500">{groupedDtc.U.length} grešaka</span>
                            )}
                        </div>
                        {expanded.U && (
                            groupedDtc.U.length > 0 ? (
                                <ul className="ml-6 mt-2 list-disc">
                                    {groupedDtc.U.map(code => (
                                        <li key={code}>{code}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="ml-6 mt-2 text-green-600">Nema aktivnih grešaka</p>
                            )
                        )}
                    </div>
                </>
            )}
        </>
    )

};

export default CarStatus;