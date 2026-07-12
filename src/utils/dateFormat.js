const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function toDate(value) {
  if (value instanceof Date) return value;
  return new Date(value);
}

export function formatDateID(value = new Date()) {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateTimeID(value = new Date()) {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return "-";
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${formatDateID(d)}, ${hours}:${minutes} WIB`;
}
