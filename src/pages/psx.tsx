import React from 'react';
import ConsolePlayer from '../components/ConsolePlayer';

export default function PSX() {
  return (
    <ConsolePlayer 
      core="psx" 
      coreName="PlayStation 1 (PS1)" 
      defaultBios="/bios/psx_bios.bin" 
      romExtensions=".iso,.bin,.chd,.pbp,.cue,.zip" 
    />
  );
}
