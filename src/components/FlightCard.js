import React from 'react';

const FlightCard = ({ flight }) => {
  const origem = flight.origin;
  const destino = flight.destination;
  const geral = flight.general;
  const aeronave = flight.aircraft;
  const alternativo = flight.alternate;
  const torre = flight.atc;
  const tempo = flight.times;
  
  
 
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
      {/* Informações do Voo */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          ✈️ Informações do Voo
        </h2>
        <p><strong>Callsing:</strong> {torre.callsign}</p>
        <p><strong>Aeronave:</strong> {aeronave.icaocode}</p>
        <p><strong>Cost Index:</strong> {geral.costindex}</p>
        <p><strong>Cruzeiro Inicial:</strong> FL{geral.initial_altitude}</p>
        <p><strong>Rota:</strong> {geral.route}</p>
        <p><strong>Aeroporto Alternativo:</strong> {alternativo.name} ({alternativo.icao_code})</p>
        <p><strong>Tempo Estimado:</strong> {tempo.est_time_enroute/60}</p>
        
        

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
        {/* Bloco Origem */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-600 mb-4">🛫 Origem</h2>
          <p><strong>Nome:</strong> {origem.name}</p>
          <p><strong>ICAO:</strong> {origem.icao_code}</p>
          <p><strong>IATA:</strong> {origem.iata_code}</p>
          <p><strong>Pista:</strong> {origem.plan_rwy}</p>
          <p><strong>METAR:</strong> {origem.metar}</p>
          <p><strong>Alt Transisão:</strong> {origem.trans_alt}</p>
          <p><strong>Elevação da Pista:</strong> {origem.elevation}</p>
          { /* <p><strong>Fuso horário:</strong> {origem.timezone}</p> */ }
        </div>

        {/* Bloco Destino */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-600 mb-4">🛬 Destino</h2>
          <p><strong>Nome:</strong> {destino.name}</p>
          <p><strong>ICAO:</strong> {destino.icao_code}</p>
          <p><strong>IATA:</strong> {destino.iata_code}</p>
          <p><strong>Pista:</strong> {destino.plan_rwy}</p>
          <p><strong>METAR:</strong> {destino.metar}</p>
          <p><strong>Alt Transisão:</strong> {destino.trans_alt}</p>
          <p><strong>Elevação da Pista:</strong> {destino.elevation}</p>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
