import React from 'react';

// A simple diamond/gem icon to represent coins
export const CoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.001 2.503L4.93 9.574l7.071 7.071 7.07-7.071-7.07-7.071zm0 2.828l4.242 4.243-4.242 4.242-4.243-4.242 4.243-4.243z" />
  </svg>
);