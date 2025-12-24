export function formatMoney(amount: number| string, { showZeroAsNumber = false } = {}) {
  const numberAmount = Number.parseFloat(amount.toString())
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: Number.isInteger(numberAmount) ? 0 : 2,
  });

  if (numberAmount === 0 && !showZeroAsNumber) return "Free";
  return formatter.format(numberAmount);
}

export function formatNumber(
  number: number,
  options?: Intl.NumberFormatOptions,
) {
  const formatter = new Intl.NumberFormat(undefined, options);
  return formatter.format(number);
}

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDate(date: Date) {
  return DATE_FORMATTER.format(date);
}

export function formatPlural(
  count: number,
  { singular, plural }: { singular: string; plural: string },
  { includeCount = true } = {},
) {
  const word = count === 1 ? singular : plural;

  return includeCount ? `${count} ${word}` : word;
}
