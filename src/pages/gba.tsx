import React from 'react';
import ConsolePlayer from '../components/ConsolePlayer';

export default function GBA() {
  return (
    <ConsolePlayer 
      core="gba" 
      coreName="Game Boy Advance (GBA)" 
      defaultBios="/bios/gba_bios.bin"
      romExtensions=".gba,.zip" 
    />
  );
}
