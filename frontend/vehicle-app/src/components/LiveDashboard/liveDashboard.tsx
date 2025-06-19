import GaugeComponent from "react-gauge-component";

const Dashboard = ({ }) => {
    return (
        <>
            <h1 className="font-semibold m-3 text-xl">Nadzorna ploča</h1>
            <div className="flex flex-row">
                <div className="card-content">
                    <p>BRZINA</p>
                    <GaugeComponent
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
                        maxValue={8000}
                        arc={{
                            subArcs: [
                                {
                                    limit:6000,
                                    color: '#5BE12C',
                                },
                                {
                                    limit:8000,
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
                    <p className="text-5xl font-thin">40 °C</p>
                </div>

                <div className="card-content">
                    <p className="text-blue-500">TEMPERATURA ZRAKA</p>
                    <p className="text-5xl font-thin">30 °C</p>
                </div>

                <div className="card-content">
                    <p className="text-yellow-600">NAPON AKOMULATORA</p>
                    <p className="text-5xl font-thin">12.3 V</p>
                </div>
            </div>
        </>
    )

};

export default Dashboard;