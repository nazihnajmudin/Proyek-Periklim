/* Format angka gaya Indonesia */

function fmtNum(x, digits) {
  return x.toLocaleString("id-ID", { minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0 });
}

function fmtRp(x) {
  // Rp -> T (triliun) atau M (miliar), tanda minus di depan
  const abs = Math.abs(x);
  const sign = x < 0 ? "-" : "";
  if (abs >= 1e12) return sign + "Rp" + fmtNum(abs / 1e12, 1) + " T";
  if (abs >= 1e9) return sign + "Rp" + fmtNum(abs / 1e9, 0) + " M";
  return sign + "Rp" + fmtNum(abs, 0);
}

function fmtPct(x, digits) {
  return fmtNum(x * 100, digits === undefined ? 1 : digits) + "%";
}

function fmtSigned(text, x) {
  return (x > 0 ? "+" : "") + text;
}
