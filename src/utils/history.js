const HISTORY_KEY = 'simbrief_history';

export const saveFlightToHistory = (flight) => {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

  const alreadyExists = history.some(
    entry =>
      entry.flight_number === flight.general.flight_number &&
      entry.origin.icao === flight.origin.icao_code &&
      entry.destination.icao === flight.destination.icao_code
  );

  if (!alreadyExists) {
    const newEntry = {
      id: Date.now(),
      datetime: new Date().toLocaleString(),
      flight_number: flight.general.flight_number,
      origin: {
        icao: flight.origin.icao_code,
        city: flight.origin.city
      },
      destination: {
        icao: flight.destination.icao_code,
        city: flight.destination.city
      }
    };

    localStorage.setItem(HISTORY_KEY, JSON.stringify([newEntry, ...history]));
  }
};

export const getFlightHistory = () => {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
};

export const clearFlightHistory = () => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
};
