const WebSocket = require('ws');
const { getLatestFlightPlan } = require('./simbriefService');

let flightPlanData = null;

let latestData = {
  lat: null,
  lon: null,
  altitude: 0,
  speed: 0,
  heading: 0,
  verticalSpeed: 0,
  callsign: '',
  origin: '',
  destination: '',
  route: '',
  cruise_level: '',
  sid: '',
  etd: '',
};

async function initSimbrief(userId = '') {
  try {
    const data = await getLatestFlightPlan(userId);
    if (!data) return;

    const general = data.general ?? {};
    const atc = data.atc ?? {};
    const origin = data.origin ?? {};
    const destination = data.destination ?? {};
    const times = data.times ?? {};

    flightPlanData = {
      callsign: general.callsign,
      origin: origin.icao_code,
      destination: destination.icao_code,
      route: atc.route,
      cruise_level: atc.altitude,
      sid: atc.sid,
      etd: times.est_time_enroute,
    };
    console.log('🛫 SimBrief carregado:', flightPlanData);
  } catch (e) {
    console.error('Erro ao carregar dados do SimBrief:', e);
  }
}

function startFSUIPCBridge(sendToClientsCallback, simbriefUserId = '') {
  const fsuipc = new WebSocket('ws://localhost:2048/fsuipc/', 'fsuipc');

  fsuipc.on('open', () => {
    console.log('[FSUIPC] Conectado');

    initSimbrief(simbriefUserId); // carrega o plano do SimBrief

    fsuipc.send(JSON.stringify({
      command: 'offsets.declare',
      name: 'flightData',
      offsets: [
        { name: 'latitudeRaw', address: 0x0560, type: 'long', size: 8 },
        { name: 'longitudeRaw', address: 0x0568, type: 'long', size: 8 },
        { name: 'altitudeRaw', address: 0x0570, type: 'long', size: 8 },
        { name: 'speedRaw', address: 0x02BC, type: 'int', size: 4 },
        { name: 'headingRaw', address: 0x0580, type: 'uint', size: 4 },
        { name: 'verticalSpeed', address: 0x02C8, type: 'int', size: 4 },
      ]
    }));

    setInterval(() => {
      fsuipc.send(JSON.stringify({ command: 'offsets.read', name: 'flightData' }));
    }, 1000);
  });

  fsuipc.on('message', (msg) => {
    const res = JSON.parse(msg);
    if (!res.success || !res.data) return;

    const d = res.data;

    const lat = d.latitudeRaw * 90 / (10001750 * 65536 * 65536);
    const lon = d.longitudeRaw * 360 / (65536 * 65536 * 65536 * 65536);
    const alt = Math.round(d.altitudeRaw / (65536 * 65536));
    const spd = Math.round(d.speedRaw / 128);
    const hdg = Math.round(d.headingRaw * 360 / (65536 * 65536));

    latestData = {
      ...latestData,
      lat,
      lon,
      altitude: alt,
      speed: spd,
      heading: hdg,
      verticalSpeed: d.verticalSpeed || 0,
      ...(flightPlanData || {}),
    };

    sendToClientsCallback({
      type: 'position',
      ...latestData,
    });
  });

  fsuipc.on('error', console.error);
}

module.exports = {
  startFSUIPCBridge,
  getCurrentFlightData: () => latestData,
};
