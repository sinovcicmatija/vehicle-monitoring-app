import GaugeComponent from "react-gauge-component";
import { startCarDataTransfer, stopCarDataTransfer } from "../../services/carService";
import { useEffect, useState } from "react";
import type { CarDataLiveDTO } from "../Util/CarDataLiveDTO";
import * as signalR from "@microsoft/signalr";

const Dashboard = ({ }) => {

    const [liveData, setLiveData] = useState<CarDataLiveDTO | null>(null);

    useEffect(() => {
        startCarDataTransfer();

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7242/hubs/cardata")
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveLiveData", data => {
            console.log("Primljeni podaci: ", data);
            setLiveData(data);
        });

        connection.start();


        return () => {
            stopCarDataTransfer();
            connection.stop();
        };
    }, []);

    return (
        <>
            <h1 className="font-semibold m-3 text-xl">Nadzorna ploča</h1>
            <div className="flex flex-row">
                <div className="card-content">
                    <p>BRZINA</p>
                    <GaugeComponent
                    value={liveData?.speed}
                        type="radial"
                        maxValue={220}
                        pointer={{
                            type: "needle"
                        }}
                        arc={{
                            cornerRadius: 1,
                            subArcs: [
                                {
                                    limit: 20,
                                    color: '#5BE12C',
                                    showTick: true
                                }

                            ]
                        }}

                    />
                </div>

                <div className="card-content">
                    <p>BROJ OKRETAJA</p>
                    <GaugeComponent
                    value={liveData?.rpm}
                        maxValue={8000}
                        arc={{
                            subArcs: [
                                {
                                    limit: 6000,
                                    color: '#5BE12C',
                                },
                                {
                                    limit: 8000,
                                    color: '#EA4228',
                                    showTick: true
                                }
                            ]


                        }} />
                </div>
            </div>
            <div className="flex flex-row">
                <div className="card-content">
                    <p>TEMPERATURA MOTORA</p>
                    <p className="text-5xl font-thin">{liveData?.engineTemperature} °C</p>
                </div>

                <div className="card-content">
                    <p className="text-blue-500">RAZINA GORIVA</p>
                    <p className="text-5xl font-thin">{liveData?.fuelLevel}</p>
                </div>

                <div className="card-content">
                    <p className="text-yellow-600">TEMPERATURA USISA ZRAKA</p>
                    <p className="text-5xl font-thin">{liveData?.intakeTemperature} °C</p>
                </div>
            </div>
        </>
    )

};

export default Dashboard;