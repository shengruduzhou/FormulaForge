export function softmax(logits: number[], temperature: number): number[] {
  const safeTemperature = Math.max(temperature, 0.001);
  const scaled = logits.map((z) => z / safeTemperature);
  const maxVal = Math.max(...scaled);
  const exps = scaled.map((z) => Math.exp(z - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export interface Point {
  x: number;
  y: number;
}

export function demoLoss({ x, y }: Point): number {
  return x * x + 2 * y * y;
}

export function gradientDescentPath(initial: Point, learningRate: number, steps: number): Point[] {
  const path = [initial];
  let current = initial;

  for (let i = 0; i < steps; i += 1) {
    const next = {
      x: current.x - learningRate * 2 * current.x,
      y: current.y - learningRate * 4 * current.y,
    };
    path.push(next);
    current = next;
  }

  return path;
}
