import '@testing-library/jest-dom';

// Mock scrollTo since jsdom does not implement it
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}

// Mock matchMedia since jsdom does not implement it (utilisé par usePWAInstall)
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}
