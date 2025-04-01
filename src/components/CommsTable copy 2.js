import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import phrasesData from '../data/commsPhrases.json';

const CommsTable = ({ simbriefData }) => {
  const [language, setLanguage] = useState('pt');
  const [activeItem, setActiveItem] = useState(0); // abre só o primeiro por padrão

  const [values, setValues] = useState({
    callsign: '',
    cruise: '',
    runway: '',
    sid: '',
    gate: '',
    atis: '',
    transponder: '',
    taxi_out: '',
    taxi_in: ''
  });

  // Preenche campos com dados do SimBrief
  useEffect(() => {
    if (!simbriefData || !simbriefData.general) return;
  
    setValues((prev) => ({
      ...prev,
      callsign: simbriefData.atc.callsign || prev.callsign,
      cruise: `FL${simbriefData.general.initial_altitude || prev.cruise}`,
      sid: simbriefData.general.sid_ident || prev.sid,
      runway: simbriefData.origin.plan_rwy || prev.runway,
      transponder: simbriefData.general.transponder || prev.transponder,
      taxi_out: simbriefData.origin?.taxi_out_time || prev.taxi_out,
      taxi_in: simbriefData.destination?.taxi_in_time || prev.taxi_in,
    }));
  }, [simbriefData]);
  
  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const replaceVars = (text) => {
    return text.replace(/\{\{(.*?)\}\}/g, (_, key) => values[key] || '____');
  };

  return (
    <div className="mt-8 p-4">
      {/* Card de Inputs */}
      <Card className="p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2"> 📋 Preencha os dados dinâmicos:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(values).map((key) => (
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
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
          ))}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
        >
          {language === 'pt' ? '🇬🇧 Ver em Inglês' : '🇧🇷 Ver em Português'}
        </button>
      </Card>

      {/* Accordions feitos com Tailwind puro */}
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
