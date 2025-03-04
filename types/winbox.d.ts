declare module "winbox" {
  export default class WinBox {
    constructor(options?: {
      title?: string;
      width?: string | number;
      height?: string | number;
      x?: string | number;
      y?: string | number;
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
      index?: number;
      mount?: HTMLElement;
      html?: string;
      modal?: boolean;
      hidden?: boolean;
      fullscreen?: boolean;
      noHeader?: boolean;
      noMin?: boolean;
      noMax?: boolean;
      noClose?: boolean;
      onclose?: () => boolean | void;
      onresize?: (width: number, height: number) => void;
      onmove?: (x: number, y: number) => void;
    });

    close(): void;
    maximize(): void;
    minimize(): void;
    restore(): void;
    fullscreen(): void;
    setTitle(title: string): void;
    setContent(content: string | HTMLElement): void;
    move(x: string | number, y: string | number): void;
    resize(width: string | number, height: string | number): void;
  }
}

declare global {
  interface Window {
    WinBox: typeof WinBox;
  }
}