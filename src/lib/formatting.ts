export function formatMoney(
  amount: number | string | undefined | null,
  { showZeroAsNumber = true } = {},
) {
  const numberAmount = Number.parseFloat(amount?.toString() ?? '0')
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: Number.isInteger(numberAmount) ? 0 : 2,
  })

  if (numberAmount === 0 && !showZeroAsNumber) return 'Free'
  return formatter.format(numberAmount)
}

export function formatNumber(
  number: number,
  options?: Intl.NumberFormatOptions,
) {
  const formatter = new Intl.NumberFormat(undefined, options)
  return formatter.format(number)
}

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      // month: opts.month ?? "long",
      // day: opts.day ?? "numeric",
      // year: opts.year ?? "numeric",
      dateStyle: "medium",
      timeStyle: "short",
      ...opts,
    }).format(new Date(date));
  } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return "";
  }
}

export function formatPlural(
  count: number,
  { singular, plural }: { singular: string; plural: string },
  { includeCount = true } = {},
) {
  const word = count === 1 ? singular : plural

  return includeCount ? `${count} ${word}` : word
}
