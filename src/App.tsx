import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NeoGeo from './pages/neogeo';
import PSX from './pages/psx';
import N64 from './pages/n64';
import SNES from './pages/snes';
import GBA from './pages/gba';
import SegaG from './pages/segag';
import NES from './pages/nes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/neogeo" element={<NeoGeo />} />
        <Route path="/psx" element={<PSX />} />
        <Route path="/n64" element={<N64 />} />
        <Route path="/snes" element={<SNES />} />
        <Route path="/gba" element={<GBA />} />
        <Route path="/segag" element={<SegaG />} />
        <Route path="/nes" element={<NES />} />
      </Routes>
    </BrowserRouter>
  );
}
