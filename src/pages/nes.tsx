import React from 'react';
import ConsolePlayer from '../components/ConsolePlayer';

export default function NES() {
  return (
    <ConsolePlayer 
      core="nes" 
      coreName="Nintendo (NES)" 
      romExtensions=".nes,.zip" 
    />
  );
}
