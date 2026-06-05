import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const consoles = [
  { id: 'neogeo', name: 'Arcade / NeoGeo', core: 'fbneo', path: '/neogeo' },
  { id: 'psx', name: 'PlayStation 1', core: 'psx', path: '/psx' },
  { id: 'n64', name: 'Nintendo 64', core: 'n64', path: '/n64' },
  { id: 'snes', name: 'Super Nintendo', core: 'snes', path: '/snes' },
  { id: 'nes', name: 'Nintendo (NES)', core: 'nes', path: '/nes' },
  { id: 'gba', name: 'Game Boy Advance', core: 'gba', path: '/gba' },
  { id: 'segag', name: 'Sega Mega Drive', core: 'genesis', path: '/segag' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-12 text-center flex flex-col items-center gap-6">
          <div className="h-20 w-20 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3">Retro Web Emulator</h1>
            <p className="text-slate-400 text-lg">Pilih console untuk mula bermain.</p>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {consoles.map(c => (
              <Link 
                to={c.path} 
                key={c.id}
                className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all flex flex-col items-center text-center gap-3"
              >
                <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                  <Gamepad2 className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">{c.name}</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{c.core}</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
