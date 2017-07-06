export const sqrt = Math.sqrt;

export function square(x) {
  return x * x;
}

export function mult(x, y) {
  return x * y;
}

export function diag(x, y) {
  return sqrt(square(x) + square(y));
}
