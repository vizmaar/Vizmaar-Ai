export const CURRENCY_RATES: Record<string, { name: string; rate: number }> = {
  USD: { name: "US Dollar", rate: 1 },
  EUR: { name: "Euro", rate: 0.92 },
  GBP: { name: "British Pound", rate: 0.79 },
  JPY: { name: "Japanese Yen", rate: 149.5 },
  INR: { name: "Indian Rupee", rate: 83.12 },
  AUD: { name: "Australian Dollar", rate: 1.53 },
  CAD: { name: "Canadian Dollar", rate: 1.36 },
  CHF: { name: "Swiss Franc", rate: 0.88 },
  CNY: { name: "Chinese Yuan", rate: 7.24 },
  AED: { name: "UAE Dirham", rate: 3.67 },
  SGD: { name: "Singapore Dollar", rate: 1.34 },
  PKR: { name: "Pakistani Rupee", rate: 278.5 },
  BDT: { name: "Bangladeshi Taka", rate: 110.2 },
  NGN: { name: "Nigerian Naira", rate: 1550 },
  ZAR: { name: "South African Rand", rate: 18.6 },
};

export const CURRENCY_CODES = Object.keys(CURRENCY_RATES);
