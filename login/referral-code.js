export function generateReferralCode({
  fullName,
  whatsapp,
  usedReferral,
  registerIndex,
  date = new Date()
}) {
  const cleanName = fullName.replace(/[^A-Za-z]/g, "").toUpperCase();
  const AA = cleanName.slice(0, 2).padEnd(2, "X");

  const digitsWA = whatsapp.replace(/\D/g, "");
  const WW = digitsWA.slice(-2);

  const R = usedReferral ? "1" : "2";

  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");
  const YY = String(date.getFullYear()).slice(-2);

  const N = String(registerIndex);

  return `${AA}${WW}${R}${MM}${DD}${YY}${N}`;
}
