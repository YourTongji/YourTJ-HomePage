import React from 'react';

export interface MockHoverProps {
  selector?: string;
}

/**
 * Disabled per user request: natural, clean interface without artificial hover overlay boxes.
 */
export const MockHover: React.FC<MockHoverProps> = () => null;
