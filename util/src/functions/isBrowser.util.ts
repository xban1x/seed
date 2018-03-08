const is_browser: boolean = typeof document === 'object' && !!document;

export function isBrowser(): boolean {
  return is_browser;
}
