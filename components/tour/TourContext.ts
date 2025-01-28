import React from 'react';

import type { SemanticName } from './interface';

export interface TourContextProps {
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
}

const TourContext = React.createContext<TourContextProps>({});

export default TourContext;
