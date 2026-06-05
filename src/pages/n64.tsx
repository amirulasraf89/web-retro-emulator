import React from 'react';
import ConsolePlayer from '../components/ConsolePlayer';

export default function N64() {
  return (
    <ConsolePlayer 
      core="n64" 
      coreName="Nintendo 64 (N64)" 
      romExtensions=".z64,.n64,.v64,.zip" 
    />
  );
}
