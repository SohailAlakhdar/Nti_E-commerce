/**
 * Human-friendly, sortable order number. Uniqueness is enforced by the
 * Order model's unique index on orderNumber combined with a retry in the
 * service layer (extremely unlikely to collide, but we don't rely on luck).
 */
const generateOrderNumber = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${y}${m}${d}-${rand}`;
};

module.exports = generateOrderNumber;
