export const AREA_RATES = {
  foodGrains: { kharif: 600, rabi: 1200, hotWeather: 1800 },
  sugarcane:  { kharif: 1890, rabi: 3780, hotWeather: 5670 },
  banana:     { kharif: 1890, rabi: 3780, hotWeather: 5670 },
  cotton:     { kharif: 810, rabi: 1620, hotWeather: 2430 },
  horticulture: { kharif: 1422, rabi: 2844, hotWeather: 4266 }
};

export const VOLUMETRIC_RATES_WUA = { kharif: 5.50, rabi: 11.00, hotWeather: 16.50 };
export const VOLUMETRIC_RATES_INDIVIDUAL = { kharif: 7.00, rabi: 14.00, hotWeather: 21.00 };

export const LIFT_RATES = {
  assuredMajor:     { kharif: 6.50, rabi: 13.00, hotWeather: 19.50 },
  assuredMedium:    { kharif: 5.00, rabi: 10.00, hotWeather: 15.00 },
  regulatedLoss:    { kharif: 5.00, rabi: 10.00, hotWeather: 15.00 },
  partlyRegulated:  { kharif: 2.50, rabi: 5.00,  hotWeather: 7.50  },
  userMaintained:   { kharif: 0.80, rabi: 1.60,  hotWeather: 2.40  }
};

export function calculateAreaBill(cropKey, seasonKey, landArea) {
  const cropRates = AREA_RATES[cropKey];
  if (!cropRates) return 0;
  const rate = cropRates[seasonKey] || 0;
  return parseFloat((rate * Number(landArea)).toFixed(2));
}

export function getAreaRate(cropKey, seasonKey) {
  return AREA_RATES[cropKey]?.[seasonKey] || 0;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}
