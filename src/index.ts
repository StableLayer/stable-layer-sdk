/**
 * Stable Layer SDK
 * A simple hello world SDK for testing
 */

/**
 * Returns a hello world message
 */
export function hello(name?: string): string {
  return `Hello, ${name || 'World'}!`;
}

/**
 * A simple greeting class
 */
export class Greeter {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet(): string {
    return `Hello from ${this.name}!`;
  }
}

/**
 * Get the SDK version
 */
export function getVersion(): string {
  return '1.0.0';
}
