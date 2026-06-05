import React from 'react';
import ConsolePlayer from '../components/ConsolePlayer';

export default function SegaG() {
  return (
    <ConsolePlayer 
      core="genesis" 
      coreName="Sega Mega Drive / Genesis" 
      romExtensions=".md,.smd,.gen,.bin,.zip" 
    />
  );
}
