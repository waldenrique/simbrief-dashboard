import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import phrasesData from '../data/commsPhrases.json';

const phoneticAlphabet = {
  A: 'Alpha',
  B: 'Bravo',
  C: 'Charlie',
  D: 'Delta',
  E: 'Echo',
  F: 'Foxtrot',
  G: 'Golf',
  H: 'Hotel',
  I: 'India',
  J: 'Juliett',
  K: 'Kilo',
  L: 'Lima',
  M: 'Mike',
  N: 'November',
  O: 'Oscar',
  P: 'Papa',
  Q: 'Quebec',
  R: 'Romeo',
  S: 'Sierra',
  T: 'Tango',
  U: 'Uniform',
  V: 'Victor',
  W: 'Whiskey',
  X: 'X-ray',
  Y: 'Yankee',
  Z: 'Zulu'
};

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
    atis: '',
    transponder: '',
    taxi_out: '',
    icao_origen: '',
    icao_destino: '',
    procesimento: '',
    star: '',
    taxi_in: ''
  });

  // Preenche campos com dados do SimBrief
  useEffect(() => {
    if (!simbriefData || !simbriefData.general) return;

    setValues((prev) => ({
      ...prev,
      callsign: simbriefData.atc?.callsign || prev.callsign,
      cruise: `FL${simbriefData.general?.initial_altitude || prev.cruise}`,
      runway_d: simbriefData.destination?.plan_rwy || prev.runway_d,
      runway: simbriefData.origin?.plan_rwy || prev.runway,
      sid: simbriefData.general?.sid_ident || prev.sid,
      star: simbriefData.general?.star_ident || prev.star,
      taxi_out: simbriefData.origin?.taxi_out_time || prev.taxi_out,
      icao_origen: simbriefData.destination?.icao_code || prev.icao_origen,
      icao_destino: simbriefData.origin?.icao_code || prev.icao_destino,
      procesimento: simbriefData.destination?.approach_type || prev.procedimento,
      taxi_in: simbriefData.destination?.taxi_in_time || prev.taxi_in,
    }));
  }, [simbriefData]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const replaceVars = (text) => {
    return text.replace(/\{\{(.*?)\}\}/g, (_, key) => {
      if (key === 'atis') {
        const letra = (values.atis || '').toUpperCase();
        return phoneticAlphabet[letra] || letra || '____';
      }
      return values[key] || '____';
    });
  };
  

  return (
    <div className="mt-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Origem */}
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">📍 Origem</h3>
          <div className="grid grid-cols-2 gap-4">
            {['callsign', 'icao_origen','sid', 'runway', 'transponder', 'gate', 'taxi_out', 'atis'].map((key) => (
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
    {['callsign', 'icao_destino', 'procedimento', 'runway_d', 'taxi_in', 'star', 'gate', 'obs'].map((key) => (
      <div key={key}>
        <label className="block text-sm font-medium mb-1 capitalize" htmlFor={key}>
          {key === 'icao' ? 'ICAO' : key.replace('_', ' ')}:
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

      </div>
            
      {/* Accordions com Tailwind */}
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
