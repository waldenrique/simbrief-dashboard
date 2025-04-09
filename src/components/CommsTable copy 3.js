import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import phrasesData from '../data/commsPhrases.json';

const CommsTable = ({ simbriefData }) => {
  const [language, setLanguage] = useState('pt');
  const [activeItem, setActiveItem] = useState(0); // abre só o primeiro por padrão

  const [values, setValues] = useState({
    callsign: '',
    cruise: '',
    runway_d: '',
    runway: '',
    sid: '',
    gate: '',
    gate_d: '',
    atis: '',
    transponder: '',
    taxi_out: '',
    icao_origen: '',
    icao_destino: '',
    procedimento: '',
    star: '',
    taxi_in: '',
    qnh: '',
    qnh_d: '',
    originAtcServices: [],
    destinationAtcServices: []
  });

  useEffect(() => {
    if (!simbriefData || !simbriefData.general) return;

    console.log("SimBrief Data Destination:", simbriefData.destination);
    console.log("SimBrief Data Origin:", simbriefData.origin);
  
    const metarOriginRaw = simbriefData.origin?.metar?.[0] || '';
    const matchOrigin = metarOriginRaw.match(/Q\d+/);
    const qnhOrigin = matchOrigin ? matchOrigin[0].replace('Q', '') : 'Sem QNH';
    
    const metarDestinationRaw = simbriefData.destination?.metar?.[0] || '';
    const matchDestination = metarDestinationRaw.match(/Q\d+/);
    const qnhDestination = matchDestination ? matchDestination[0].replace('Q', '') : 'Sem QNH';
    
  
    setValues((prev) => ({
      ...prev,
      callsign: simbriefData.atc?.callsign || prev.callsign,
      cruise: `FL${simbriefData.general?.initial_altitude || prev.cruise}`,
      runway_d: simbriefData.destination?.plan_rwy || prev.runway_d,
      runway: simbriefData.origin?.plan_rwy || prev.runway,
      sid: simbriefData.general?.sid_ident || prev.sid,
      star: simbriefData.general?.star_ident || prev.star,
      taxi_out: simbriefData.origin?.taxi_out_time || prev.taxi_out,
      icao_origen: simbriefData.origin?.icao_code || prev.icao_origen,
      icao_destino: simbriefData.destination?.icao_code || prev.icao_destino,
      procedimento: simbriefData.destination?.approach_type || prev.procedimento,
      taxi_in: simbriefData.destination?.taxi_in_time || prev.taxi_in,
      gate: simbriefData.origin?.gate || prev.gate,
      gate_d: simbriefData.destination?.gate || prev.gate_d,
      qnh: qnhOrigin || prev.qnh,
      qnh_d: qnhDestination || prev.qnh_d,
    }));
  }, [simbriefData]);
  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (type, service, checked) => {
    setValues((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], service]
        : prev[type].filter((s) => s !== service),
    }));
  };

  const replaceVars = (text) => {
    return text.replace(/\{\{(.*?)\}\}/g, (_, key) => {
      switch (key) {
        case 'origin_city':
          return simbriefData.origin?.name || 'Origem';
        case 'destination_city':
          return simbriefData.destination?.name || 'Destino';
        case 'origin_service':
          return values.originAtcServices?.[0] || 'Tráfego';
        case 'destination_service':
          return values.destinationAtcServices?.[0] || 'Tráfego';
        case 'atis':
          const atisLetter = values.atis?.toUpperCase();
          const atisMap = {
            A: 'Alpha', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot',
            G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliett', K: 'Kilo', L: 'Lima',
            M: 'Mike', N: 'November', O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo',
            S: 'Sierra', T: 'Tango', U: 'Uniform', V: 'Victor', W: 'Whiskey',
            X: 'X-ray', Y: 'Yankee', Z: 'Zulu'
          };
          return atisMap[atisLetter] || values.atis || '____';
        case 'qnh':
          return values.qnh || '____';
        case 'qnh_d':
          return values.qnh_d || '____';
        default:
          return values[key] || '____';
      }
    });
  };

  return (
    <div className="mt-8 p-4">
      {/* 🌐 Idioma das Frases */}
      <Card className="w-full grid-cols-1 mt-6 mb-6 p-6 bg-white rounded shadow text-center">
        <h3 className="text-lg font-semibold mb-2">🌐 Idioma das Frases</h3>
        <p className="text-sm text-gray-600 mb-4">Escolha o idioma desejado para as comunicações:</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setLanguage('pt')}
            className={`px-6 py-2 rounded font-medium text-white transition ${
              language === 'pt' ? 'bg-blue-700' : 'bg-gray-500'
            }`}
          >
            🇧🇷 Português
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-6 py-2 rounded font-medium text-white transition ${
              language === 'en' ? 'bg-blue-700' : 'bg-gray-500'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </Card>

      {/* ✅ Serviços ATC Origem */}
      <Card className="p-4 mb-4 w-full">
        <h3 className="text-lg font-semibold mb-2">📍 Serviços ATC da Origem</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Tráfego', 'Solo', 'Torre', 'Aproximação', 'Centro'].map((service) => (
            <label key={service} className="flex items-center">
              <input
                type="checkbox"
                value={service}
                checked={values.originAtcServices.includes(service)}
                onChange={(e) => handleServiceChange('originAtcServices', service, e.target.checked)}
              />
              <span className="ml-2">{service}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* ✅ Serviços ATC Destino */}
      <Card className="p-4 mb-4 w-full">
        <h3 className="text-lg font-semibold mb-2">🎯 Serviços ATC do Destino</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Tráfego', 'Solo', 'Torre', 'Aproximação', 'Centro'].map((service) => (
            <label key={service} className="flex items-center">
              <input
                type="checkbox"
                value={service}
                checked={values.destinationAtcServices.includes(service)}
                onChange={(e) => handleServiceChange('destinationAtcServices', service, e.target.checked)}
              />
              <span className="ml-2">{service}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Cards de Origem e Destino */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Origem */}
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">📍 Origem</h3>
          <div className="grid grid-cols-2 gap-4">
            {['callsign', 'icao_origen', 'sid', 'runway', 'transponder', 'gate', 'taxi_out', 'atis'].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize" htmlFor={key}>
                  {key.replace('_', ' ')}:
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={values[key]}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Destino */}
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">🎯 Destino</h3>
          <div className="grid grid-cols-2 gap-4">
           {['callsign', 'icao_destino', 'procedimento', 'runway_d', 'taxi_in', 'star', 'gate_d'].map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1 capitalize" htmlFor={key}>
                {key.replace('_', ' ')}:
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={values[key]}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                list={key === 'procedimento' ? 'procedure-options' : undefined}
              />
              {key === 'procedimento' && (
                <datalist id="procedure-options">
                  <option value="ILS" />
                  <option value="RNAV" />
                  <option value="NDB" />
                  <option value="VOR" />
                  <option value="VISUAL" />
                </datalist>
              )}
  </div>
))}
          </div>
        </Card>
      </div>

      {/* Accordions das frases */}
      {phrasesData.map((section, idx) => (
        <div key={idx} className="mb-4 border border-gray-300 rounded overflow-hidden">
          <button
            onClick={() => setActiveItem(activeItem === idx ? null : idx)}
            className="w-full text-left p-4 font-semibold bg-gray-100 hover:bg-gray-200 transition"
          >
            {section.phase}
          </button>
          {activeItem === idx && (
            <div className="p-4 space-y-3 bg-white">
              {section[language].map((line, i) => (
                <div key={i} className="bg-gray-100 p-3 rounded shadow">
                  {line.piloto && (
                    <p><strong>👨‍✈️ Piloto:</strong> {replaceVars(line.piloto)}</p>
                  )}
                  {line.atc && (
                    <p><strong>📡 ATC:</strong> {replaceVars(line.atc)}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommsTable;
