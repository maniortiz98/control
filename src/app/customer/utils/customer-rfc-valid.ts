export function validateRFCMonth(rfc: string): boolean {
  // Extraer el mes del RFC
  const monthPart = rfc.slice(6, 8);

  // Regex para validar el mes: MM
  const monthRegex = /^(0[1-9]|1[0-2])$/;

  return monthRegex.test(monthPart);
}

export function validateRFCDay(rfc: string): boolean {
  // Extraer el día y el mes del RFC
  const monthPart = rfc.slice(6, 8);
  const dayPart = rfc.slice(8, 10);

  // Regex para validar el día: DD
  const dayRegex = /^(0[1-9]|[12][0-9]|3[01])$/;

  if (!dayRegex.test(dayPart)) {
    return false; // El día no tiene un formato válido
  }

  const month = parseInt(monthPart, 10);
  const day = parseInt(dayPart, 10);

  // Considerar años bisiestos para el mes de febrero
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return day <= daysInMonth[month - 1];
}
