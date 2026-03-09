/// <reference types="vite/client" />
declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.svg?react' {
  import * as React from 'react';

  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;

  export default ReactComponent;
}

declare module '*.scss';
declare module '*.css';
