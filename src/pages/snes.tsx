import React from 'react';
import ConsolePlayer from '../components/ConsolePlayer';

export default function SNES() {
  return (
    <ConsolePlayer 
      core="snes" 
      coreName="Super Nintendo (SNES)" 
      romExtensions=".smc,.sfc,.zip" 
    />
  );
}
