import React, { createContext, useState, useContext, useEffect } from 'react';
import { getLatestFlightPlan } from '../services/simbriefService';

const SimbriefContext = createContext();

export const SimbriefProvider = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedId = localStorage.getItem('simbrief_user_id');
    if (savedId) {
      setUserId(savedId);
    }
  }, []);

  const updateUserId = async (newId) => {
    const trimmedId = newId.trim();

    if (!trimmedId) {
      setError('Por favor, digite um ID válido.');
      return;
    }

    try {
      const result = await getLatestFlightPlan(trimmedId);

      if (result) {
        setUserId(trimmedId);
        localStorage.setItem('simbrief_user_id', trimmedId);
        setError(null);
      } else {
        setError('ID inválido. Nenhum plano encontrado.');
      }
    } catch (e) {
      console.error('Erro ao validar ID:', e);
      setError('Erro ao validar ID. Tente novamente.');
    }
  };

  return (
    <SimbriefContext.Provider value={{ userId, updateUserId, error }}>
      {children}
    </SimbriefContext.Provider>
  );
};

export const useSimbrief = () => useContext(SimbriefContext);
