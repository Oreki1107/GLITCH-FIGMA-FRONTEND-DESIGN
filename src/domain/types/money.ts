export type Money = {
  amount: number;
  currencyCode: string;
  formatted: string;
};

export function money(amount: number, currencyCode = "USD"): Money {
  return {
    amount,
    currencyCode,
    formatted: `$${amount}`,
  };
}
