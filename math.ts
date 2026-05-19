/**
 * A collection of mathematical utility functions.
 * @module
 */

/**
 * Adds two numbers together.
 *
 * @example
 * ```ts
 * import { add } from "./math.ts";
 *
 * const result = add(5, 3);
 * console.log(result); // 8
 * ```
 *
 * @param x The first number
 * @param y The second number
 * @returns The sum of x and y
 */
export function add(x: number, y: number): number {
  return x + y;
}

/**
 * Multiplies two numbers together.
 *
 * @example
 * ```ts
 * import { multiply } from "./math.ts";
 *
 * const result = multiply(4, 3);
 * console.log(result); // 12
 * ```
 *
 * @param x The first number
 * @param y The second number
 * @returns The product of x and y
 */
export function multiply(x: number, y: number): number {
  return x * y;
}

/**
 * Represents a 2D point in space.
 *
 * @example
 * ```ts
 * import { Point } from "./math.ts";
 *
 * const point = new Point(5, 10);
 * console.log(point.distance()); // 11.180339887498949
 * ```
 */
export class Point {
  /**
   * Creates a new Point instance.
   *
   * @param x The x-coordinate
   * @param y The y-coordinate
   */
  constructor(public x: number, public y: number) {}

  /**
   * Calculates the distance from the origin (0, 0).
   *
   * @returns The distance from the origin
   */
  distance(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Calculates the distance to another point.
   *
   * @param other The other point
   * @returns The distance between the two points
   */
  distanceTo(other: Point): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

/**
 * Configuration options for mathematical operations.
 */
export interface MathConfig {
  /** The precision for floating-point calculations */
  precision?: number;
  /** Whether to round results to integers */
  roundToInt?: boolean;
}

/**
 * Performs advanced mathematical operations with configuration.
 *
 * @example
 * ```ts
 * import { calculate } from "./math.ts";
 *
 * const result = calculate(10, 3, { precision: 2, roundToInt: false });
 * console.log(result); // 3.33
 * ```
 */
export function calculate(
  dividend: number,
  divisor: number,
  config: MathConfig = {},
): number {
  const { precision = 10, roundToInt = false } = config;

  let result = dividend / divisor;

  if (roundToInt) {
    result = Math.round(result);
  } else {
    result = Math.round(result * Math.pow(10, precision)) /
      Math.pow(10, precision);
  }

  return result;
}
