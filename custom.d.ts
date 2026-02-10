// FIX: Replaced import with triple-slash reference to avoid module scope issues
// that could be overriding the global JSX namespace instead of augmenting it.
/// <reference types="react" />

// This file augments React's JSX definitions and adds other global types.

// FIX: Defined a type alias `AIStudio` and used it for `window.aistudio`. This resolves the
// "Subsequent property declarations must have the same type" error. This allows TypeScript
// to correctly process this declaration file, making the global type for `mux-player` available.
type AIStudio = {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
};

// FIX: Wrapped global declarations in `declare global` and added `export {}` to make this file a module.
// This is required for augmenting global types when `isolatedModules` is enabled in tsconfig,
// and it resolves errors related to 'mux-player' and top-level declarations.
declare global {
  // Add a global type for the aistudio window object to satisfy TypeScript
  interface Window {
    aistudio?: AIStudio;
  }

  namespace JSX {
    interface IntrinsicElements {
      'mux-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'stream-type'?: string;
        'playback-id'?: string;
        'metadata-video-title'?: string;
        'metadata-viewer-user-id'?: string;
        'env-key'?: string;
        autoplay?: boolean | string;
        muted?: boolean;
        controls?: boolean;
      }, HTMLElement>;
    }
  }
}

export {};
