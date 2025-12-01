import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import phrasesData from '../data/commsPhrases.json';
import { FaGlobeAmericas, FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CommsTable = ({ simbriefData }) => {
  const [language, setLanguage] = useState('pt');
  const [activeItem, setActiveItem] = useState(0);

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

    const metarOriginRaw = simbriefData.origin?.metar?.[0] || '';
    const matchOrigin = metarOriginRaw.match(/Q\d+/);
    const qnhOrigin = matchOrigin ? matchOrigin[0].replace('Q', '') : '';

    const metarDestinationRaw = simbriefData.destination?.metar?.[0] || '';
    const matchDestination = metarDestinationRaw.match(/Q\d+/);
    const qnhDestination = matchDestination ? matchDestination[0].replace('Q', '') : '';

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
    <div className="mt-8 space-y-6">
      {/* 🌐 Idioma das Frases */}
      <Card className="text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-aviation-500 to-purple-500"></div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-aviation-400">
            <FaGlobeAmericas className="text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-100">Idioma das Frases</h3>
          <p className="text-sm text-slate-400 mb-6">Escolha o idioma desejado para as comunicações</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setLanguage('pt')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${language === 'pt'
                  ? 'bg-aviation-600 text-white shadow-lg shadow-aviation-600/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
            >
              <span>🇧🇷 Português</span>
              {language === 'pt' && <FaCheck className="text-xs" />}
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${language === 'en'
                  ? 'bg-aviation-600 text-white shadow-lg shadow-aviation-600/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
            >
              <span>🇬🇧 English</span>
              {language === 'en' && <FaCheck className="text-xs" />}
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Serviços ATC Origem */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-emerald-400">📍 Serviços ATC da Origem</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Tráfego', 'Solo', 'Torre', 'Aproximação', 'Centro'].map((service) => (
              <label key={service} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  value={service}
                  checked={values.originAtcServices.includes(service)}
                  onChange={(e) => handleServiceChange('originAtcServices', service, e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 text-aviation-500 focus:ring-aviation-500 bg-slate-900"
                />
                <span className="text-slate-300 text-sm">{service}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* ✅ Serviços ATC Destino */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-amber-400">🎯 Serviços ATC do Destino</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Tráfego', 'Solo', 'Torre', 'Aproximação', 'Centro'].map((service) => (
              <label key={service} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  value={service}
                  checked={values.destinationAtcServices.includes(service)}
                  onChange={(e) => handleServiceChange('destinationAtcServices', service, e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 text-aviation-500 focus:ring-aviation-500 bg-slate-900"
                />
                <span className="text-slate-300 text-sm">{service}</span>
              </label>
            ))}
          </div>
        </Card>
      </div>

      {/* Cards de Origem e Destino */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Origem */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-emerald-400">📍 Dados da Origem</h3>
          <div className="grid grid-cols-2 gap-4">
            {['callsign', 'icao_origen', 'sid', 'runway', 'transponder', 'gate', 'taxi_out', 'atis'].map((key) => (
              <div key={key}>
                <label className="block text-xs font-medium mb-1 capitalize text-slate-400" htmlFor={key}>
                  {key.replace('_', ' ')}
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={values[key]}
                  onChange={handleChange}
                  className="input-field w-full px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Destino */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-amber-400">🎯 Dados do Destino</h3>
          <div className="grid grid-cols-2 gap-4">
            {['callsign', 'icao_destino', 'procedimento', 'runway_d', 'taxi_in', 'star', 'gate_d', 'obs_d'].map((key) => (
              <div key={key}>
                <label className="block text-xs font-medium mb-1 capitalize text-slate-400" htmlFor={key}>
                  {key === 'obs_d' ? 'Observações' : key.replace('_', ' ')}
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={values[key]}
                  onChange={handleChange}
                  className="input-field w-full px-3 py-2 text-sm"
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
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100 mb-4">Fraseologia</h3>
        {phrasesData.map((section, idx) => (
          <div key={idx} className="glass-card overflow-hidden border border-slate-700/50">
            <button
              onClick={() => setActiveItem(activeItem === idx ? null : idx)}
              className={`w-full text-left p-4 font-semibold flex justify-between items-center transition-colors ${activeItem === idx ? 'bg-aviation-600/20 text-aviation-400' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
            >
              <span>{section.phase}</span>
              {activeItem === idx ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {activeItem === idx && (
              <div className="p-4 space-y-3 bg-slate-900/30">
                {section[language].map((line, i) => (
                  <div key={i} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    {line.piloto && (
                      <p className="mb-2 text-slate-300">
                        <strong className="text-aviation-400 mr-2">👨‍✈️ Piloto:</strong>
                        <span className="font-mono">{replaceVars(line.piloto)}</span>
                      </p>
                    )}
                    {line.atc && (
                      <p className="text-slate-300">
                        <strong className="text-emerald-400 mr-2">📡 ATC:</strong>
                        <span className="font-mono">{replaceVars(line.atc)}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommsTable;
