'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export const Loading = () => {
  return (   
      <ProgressBar
        height="5px"
        color="#FC4601"
      />
  );
}
  