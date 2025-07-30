import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { GiCartwheel } from "react-icons/gi";
import { GiCarSeat } from "react-icons/gi";
import { MdElectricBolt } from "react-icons/md";
import { getDtc } from "../../services/carService";
import carSvg from '../../assets/car-outline.svg';
import powertrainSvg from '../../assets/car-powertrain.svg';
import powertrainGreenSvg from '../../assets/car-powertrain-green.svg';
import chasisSvg from '../../assets/car-chasis.svg';
import chasisGreenSvg from '../../assets/car-chasis-green.svg';
import bodySvg from '../../assets/car-body.svg';
import bodyGreenSvg from '../../assets/car-body-green.svg';
import networkSvg from '../../assets/car-network.svg';
import networkGreenSvg from '../../assets/car-network-green.svg';


const CarStatus = ({ }) => {
    const [dtc, setDtc] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [openOrder, setOpenOrder] = useState<string[]>([]);
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
    const activeTypes = {
        P: groupedDtc.P.length > 0,
        C: groupedDtc.C.length > 0,
        B: groupedDtc.B.length > 0,
        U: groupedDtc.U.length > 0,
    };

    const toggle = (type: keyof typeof expanded) => {
        setExpanded(prev => {
            const newState = { ...prev, [type]: !prev[type] };

            setOpenOrder(prevOrder => {
                if (newState[type]) {
                    return [...prevOrder.filter(item => item !== type), type];
                } else {
                    return prevOrder.filter(item => item !== type);
                }
            });

            return newState;
        });
    };

    const getOpacity = (type: keyof typeof expanded) => {
        if (!expanded[type]) return 20;

        const index = openOrder.indexOf(type);
        if (index === -1) return 20;

        const reversedIndex = openOrder.length - 1 - index;
        const opacityMap = [80, 60, 40, 20];
        return opacityMap[reversedIndex] || 20;
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
                    <div className="grid grid-cols-1 md:grid-cols-2 items-start p-10">
                        <div className="flex flex-col gap-4 justify-center h-full md:pl-20">
                            <div className="mb-6">
                                {dtc.length === 0 ? (
                                    <h2 className="text-green font-semibold text-2xl ">Vozilo je u ispravnom stanju</h2>
                                ) : (
                                    <h2 className="text-red font-semibold text-2xl">
                                        Ukupno grešaka: {dtc.length}
                                    </h2>
                                )}
                            </div>
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
                        </div>
                        <div className="relative w-96 h-auto pt-0">
                            <img src={carSvg} alt="Car Outline" className="w-full h-auto" />
                            {activeTypes.P ? (
                                <img
                                    src={powertrainSvg}
                                    alt="Powertrain Overlay"
                                    className={`absolute top-10 left-12 w-72 h-auto pointer-events-none`}
                                    style={{ opacity: `${getOpacity("P")}%` }}
                                />
                            ) : (
                                <img
                                    src={powertrainGreenSvg}
                                    alt="Powertrain Overlay"
                                    className={`absolute top-10 left-12 w-72 h-auto pointer-events-none`}
                                    style={{ opacity: `${getOpacity("P")}%` }}
                                />
                            )}
                            {activeTypes.C ? (
                                <img
                                    src={chasisSvg}
                                    alt="Chasis Overlay"
                                    className={`absolute top-2 left-0 w-85 h-auto pointer-events-none`}
                                    style={{ opacity: `${getOpacity("C")}%` }}
                                />
                            ) : (
                                <img
                                    src={chasisGreenSvg}
                                    alt="Chasis Overlay"
                                    className={`absolute top-2 left-0 w-85 h-auto pointer-events-none`}
                                    style={{ opacity: `${getOpacity("C")}%` }}
                                />
                            )}
                            {activeTypes.B ? (
                                <img
                                    src={bodySvg}
                                    alt="Body Overlay"
                                    className={`absolute top-20 left-12 w-72 h-auto pointer-events-none`}
                                    style={{ opacity: `${getOpacity("B")}%` }}
                                />
                            ) : (
                                <img
                                    src={bodyGreenSvg}
                                    alt="Body Overlay"
                                    className={`absolute top-20 left-12 w-72 h-auto pointer-events-none`}
                                    style={{ opacity: `${getOpacity("B")}%` }}
                                />
                            )}
                            {activeTypes.U ? (
                                <img
                                    src={networkSvg}
                                    alt="Powertrain Overlay"
                                    className={`absolute top-1/4 right-28 w-40 h-auto pointer-events-none opacity-20`}
                                    style={{ opacity: `${getOpacity("U")}%` }}
                                />
                            ) : (
                                <img
                                    src={networkGreenSvg}
                                    alt="Powertrain Overlay"
                                    className={`absolute top-1/4 right-28 w-40 h-auto pointer-events-none opacity-20`}
                                    style={{ opacity: `${getOpacity("U")}%` }}
                                />
                            )}
                        </div>
                    </div>

                </>
            )}

        </>
    )

};

export default CarStatus;