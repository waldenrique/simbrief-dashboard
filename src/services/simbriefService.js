import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export const getLatestFlightPlan = async (userId) => {
  try {
    const response = await axios.get(
      `https://www.simbrief.com/api/xml.fetcher.php?userid=${userId}`
    );

    const result = await parseStringPromise(response.data, { explicitArray: true });

    console.log("⚙️ Resultado bruto do XML:", JSON.stringify(result, null, 2));

    // Aceita tanto <ofp> quanto <OFP>
    const rawOfp = result.ofp || result.OFP;

    if (!rawOfp) {
      console.warn("❌ XML encontrado, mas sem tag <ofp> ou <OFP>.");
      return null;
    }

    const ofp = rawOfp;

    return {
      general: ofp.general?.[0] ?? {},
      aircraft: ofp.aircraft?.[0] ?? {},
      origin: ofp.origin?.[0] ?? {},
      destination: ofp.destination?.[0] ?? {},
      alternate: ofp.alternate?.[0] ?? {},
      fuel: ofp.fuel?.[0] ?? {},
      weights: ofp.weights?.[0] ?? {},
      passengers: ofp.passengers?.[0] ?? {},
      times: ofp.times?.[0] ?? {},
      navlog: ofp.navlog?.[0] ?? {},
      atc: ofp.atc?.[0] ?? {},
      ofp_html: ofp.ofp_html?.[0] ?? null,
    };
  } catch (error) {
    console.error("🛑 Erro ao buscar plano do Simbrief:", error);
    return null;
  }
};
