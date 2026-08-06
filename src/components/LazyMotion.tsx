import React from 'react';

// Lazy load the motion library to reduce initial bundle size
export const Motion = React.lazy(() => import('motion/react'));
