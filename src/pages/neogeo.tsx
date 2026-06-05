import React from 'react';
import ConsolePlayer from '../components/ConsolePlayer';

export default function NeoGeo() {
  return (
    <ConsolePlayer 
      core="fbneo" 
      coreName="Arcade / NeoGeo (ZIP)" 
      romExtensions=".zip" 
    />
  );
}
