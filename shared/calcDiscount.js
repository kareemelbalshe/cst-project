export default function calcDiscount(price, discount) {
  return Math.round((price - (price * discount) / 100) * 100) / 100;
}
