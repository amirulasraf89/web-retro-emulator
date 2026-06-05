import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, FileDown, Upload, Play, MonitorPlay, FileCheck, HardDrive, Save, Trash2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { get, set, keys, del } from 'idb-keyval';
import { Link } from 'react-router-dom';

export interface StoredGame {
  id: string;
  name: string;
  file: File;
  core: string;
  size: number;
}

interface ConsolePlayerProps {
  core: string;
  coreName: string;
  defaultBios?: string;
  romExtensions: string;
}

export default function ConsolePlayer({ core, coreName, defaultBios, romExtensions }: ConsolePlayerProps) {
  const [romFile, setRomFile] = useState<File | null>(null);
  const [biosFile, setBiosFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [gameSourceType, setGameSourceType] = useState<'upload' | 'library'>('library');
  const [selectedLibraryGame, setSelectedLibraryGame] = useState<string>('');
  const [libraryGames, setLibraryGames] = useState<StoredGame[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadLibrary();
    loadBios();

    const handleMessage = async (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'DEBUG') {
        console.log('[EMU DEBUG]', data.msg);
        return;
      }

      if (data.type === 'SAVE_SRAM_DATA' && data.gameName && data.stateData) {
        try {
          const key = `sram_${core}_${data.gameName}`;
          const sramBytes = data.stateData instanceof ArrayBuffer
            ? new Uint8Array(data.stateData)
            : data.stateData;
          await set(key, sramBytes);
        } catch (e) {
          console.error('[SRAM] Failed to save SRAM:', e);
        }
      }

      if (data.type === 'SAVE_STATE_DATA' && data.gameName && data.stateData) {
        try {
          const key = `state_${core}_${data.gameName}`;
          const stateBytes = data.stateData instanceof ArrayBuffer
            ? new Uint8Array(data.stateData)
            : data.stateData;
          await set(key, stateBytes);
        } catch (e) {
          console.error('Failed to save state', e);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [core]);

  const loadBios = async () => {
    try {
      const savedBios = await get(`bios_${core}`);
      if (savedBios) {
        setBiosFile(savedBios as File);
      }
    } catch (e) {
      console.error("Failed to load bios", e);
    }
  };

  const loadLibrary = async () => {
    try {
      const gameKeys = await keys();
      const games = await Promise.all(gameKeys.map(k => get(k)));
      const allGames = games.filter(Boolean) as StoredGame[];
      setLibraryGames(allGames.filter(g => g.core === core));
    } catch (e) {
      console.error("Failed to load games from IndexedDB", e);
    }
  };

  const romInputRef = useRef<HTMLInputElement>(null);
  const biosInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRomDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setRomFile(file);
  };

  const handleBiosDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setBiosFile(file);
      await set(`bios_${core}`, file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const startGame = () => {
    if (gameSourceType === 'upload' && !romFile) return;
    if (gameSourceType === 'library' && !selectedLibraryGame) return;
    setIsPlaying(true);
  };

  const stopGame = () => {
    setIsPlaying(false);
  };

  const handleSaveToLibrary = async () => {
    if (!romFile || !core) return;
    setIsSaving(true);
    try {
      const id = Date.now().toString();
      const newGame: StoredGame = {
        id,
        name: romFile.name,
        file: romFile,
        core: core,
        size: romFile.size,
      };
      await set(id, newGame);
      await loadLibrary();
      setGameSourceType('library');
      setSelectedLibraryGame(id);
    } catch (e) {
      console.error("Failed to save game", e);
      alert("Gagal menyimpan game ke dalam pangkalan data. Game mungkin terlalu besar.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGame = async (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await del(gameId);
      if (selectedLibraryGame === gameId) {
        setSelectedLibraryGame('');
      }
      await loadLibrary();
    } catch (e) {
      console.error("Failed to delete game", e);
    }
  };

  const handleIframeLoad = async () => {
    console.log('[LOAD] handleIframeLoad fired, gameSourceType:', gameSourceType, 'selectedLibraryGame:', selectedLibraryGame, 'libraryGames count:', libraryGames.length);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      let gameName = "Retro Game";
      let gameFile: File | string | null = null;

      if (gameSourceType === 'upload' && romFile) {
        gameFile = romFile;
        gameName = romFile.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
      } else if (gameSourceType === 'library' && selectedLibraryGame) {
        const game = libraryGames.find(g => g.id === selectedLibraryGame);
        console.log('[LOAD] found game in library:', game ? game.name : 'NOT FOUND');
        if (game) {
          gameFile = game.file;
          gameName = game.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
        }
      }

      if (!gameFile) { console.log('[LOAD] gameFile is null, aborting'); return; }

      const sramData = await get(`sram_${core}_${gameName}`).catch(() => null);
      const stateData = await get(`state_${core}_${gameName}`).catch(() => null);

      console.log('[LOAD] gameName:', gameName, 'sramData:', sramData ? `Uint8Array(${(sramData as Uint8Array).byteLength})` : 'null');

      iframeRef.current.contentWindow.postMessage({
        type: 'START_EMULATOR',
        core: core,
        gameName: gameName,
        gameFile: gameFile,
        biosFile: biosFile || defaultBios,
        sramData: sramData || null,
        stateData: stateData || null,
      }, '*');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">{coreName}</h1>
              <p className="text-slate-400 text-sm mt-1">Play {coreName} games.</p>
            </div>
          </div>
          {isPlaying && (
            <button 
              onClick={stopGame}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Close Game
            </button>
          )}
        </header>

        <main>
          <AnimatePresence mode="wait">
            {!isPlaying ? (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid md:grid-cols-2 gap-6"
              >
                
                {/* Game Source Selection */}
                <div className="flex flex-col gap-4 md:col-span-2 mb-4">
                  <div className="flex gap-4 border-b border-slate-800 pb-2">
                    <button
                      onClick={() => setGameSourceType('library')}
                      className={`pb-2 px-1 text-lg font-medium transition-colors border-b-2 ${
                        gameSourceType === 'library' 
                          ? 'border-indigo-500 text-indigo-400' 
                          : 'border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      My Library
                    </button>
                    <button
                      onClick={() => setGameSourceType('upload')}
                      className={`pb-2 px-1 text-lg font-medium transition-colors border-b-2 ${
                        gameSourceType === 'upload' 
                          ? 'border-indigo-500 text-indigo-400' 
                          : 'border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Upload ROM
                    </button>
                  </div>
                </div>

                {gameSourceType === 'library' ? (
                  <div className="flex flex-col gap-4 md:col-span-2">
                    {libraryGames.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {libraryGames.map(game => (
                          <div
                            key={game.id}
                            onClick={() => setSelectedLibraryGame(game.id)}
                            className={`group relative flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                              selectedLibraryGame === game.id
                                ? 'bg-indigo-600/10 border-indigo-500 text-white'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50'
                            }`}
                          >
                            <span className="font-semibold break-all">{game.name}</span>
                            <span className="text-xs text-slate-500 mt-1">{(game.size / (1024 * 1024)).toFixed(2)} MB</span>
                            
                            <button
                              onClick={(e) => handleDeleteGame(game.id, e)}
                              className="absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                              title="Delete Game"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                        <HardDrive className="w-12 h-12 text-slate-700 md:mx-auto mb-4" />
                        <p className="text-slate-400">Tiada game disimpan lagi untuk console ini.</p>
                        <p className="text-sm text-slate-500 mt-2">Sila muat naik fail game di bahagian "Upload ROM" dan tekan butang "Save to Library" untuk simpan.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* ROM Upload Section */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 px-1">
                        <MonitorPlay className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-lg font-medium text-white">Select ROM File</h2>
                      </div>
                      <div 
                        onClick={() => romInputRef.current?.click()}
                        onDrop={handleRomDrop}
                        onDragOver={handleDragOver}
                        className={`
                          relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 
                          flex flex-col items-center justify-center text-center transition-all min-h-[240px]
                          ${romFile ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'}
                        `}
                      >
                        <input 
                          type="file" 
                          ref={romInputRef} 
                          className="hidden" 
                          accept={`${romExtensions},*/*`}
                          onChange={(e) => {
                            if (e.target.files?.[0]) setRomFile(e.target.files[0]);
                          }}
                        />
                        
                        {romFile ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <FileCheck className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-indigo-100 font-medium break-all">{romFile.name}</p>
                              <p className="text-indigo-400/80 text-sm mt-1">{(romFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 hover:text-slate-400">Click to change file</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-900 group-hover:bg-slate-800 transition-colors flex items-center justify-center">
                              <Upload className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-slate-300 font-medium">Click or drag ROM file here</p>
                              <p className="text-slate-500 text-sm mt-1">Supports {romExtensions}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BIOS Upload Section */}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1 px-1">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-5 h-5 text-slate-400" />
                          <h2 className="text-lg font-medium text-white">BIOS File (Optional)</h2>
                        </div>
                        <p className="text-sm text-slate-500">Recommended for better compatibility.</p>
                      </div>
                      
                      <div 
                        onClick={() => biosInputRef.current?.click()}
                        onDrop={handleBiosDrop}
                        onDragOver={handleDragOver}
                        className={`
                          relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 
                          flex flex-col items-center justify-center text-center transition-all min-h-[240px]
                          ${biosFile ? 'border-slate-600 bg-slate-800/20' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'}
                        `}
                      >
                        <input 
                          type="file" 
                          ref={biosInputRef} 
                          className="hidden" 
                          accept=".bin,.zip,*/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setBiosFile(file);
                              await set(`bios_${core}`, file);
                            }
                          }}
                        />
                        
                        {biosFile ? (
                          <div className="flex flex-col items-center gap-3 relative w-full h-full justify-center">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                setBiosFile(null);
                                await del(`bios_${core}`);
                              }}
                              className="absolute top-2 right-2 p-2 text-slate-500 hover:text-red-400 bg-slate-900/50 hover:bg-slate-800 rounded-lg transition-colors z-20"
                              title="Clear BIOS"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                              <FileCheck className="w-6 h-6 text-slate-300" />
                            </div>
                            <div>
                              <p className="text-slate-200 font-medium break-all">{biosFile.name}</p>
                              <p className="text-slate-500 text-sm mt-1">{(biosFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 hover:text-slate-400">Click to change file</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-900 group-hover:bg-slate-800 transition-colors flex items-center justify-center">
                              <FileDown className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="text-slate-400 font-medium">Click or drag BIOS file here</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {gameSourceType === 'upload' && romFile && (
                      <div className="md:col-span-2 pt-2 flex justify-center">
                        <button
                          onClick={handleSaveToLibrary}
                          disabled={isSaving}
                          className="px-6 py-3 rounded-xl font-medium transition-colors border border-indigo-500/50 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {isSaving ? "Menyimpan ke pangkalan data..." : "Save to Library"}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Start Button */}
                <div className="md:col-span-2 pt-6 flex justify-center">
                  <button
                    onClick={startGame}
                    disabled={gameSourceType === 'upload' ? !romFile : !selectedLibraryGame}
                    className={`
                      relative overflow-hidden group flex items-center gap-3 px-8 py-4 rounded-xl font-medium text-lg transition-all
                      ${(gameSourceType === 'upload' ? romFile : selectedLibraryGame)
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                    `}
                  >
                    <Play className={`w-5 h-5 ${(gameSourceType === 'upload' ? romFile : selectedLibraryGame) ? 'fill-current' : ''}`} />
                    Start Playing
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="game"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="fixed inset-0 z-50 md:relative md:z-auto md:aspect-[4/3] w-full max-w-4xl mx-auto bg-black md:bg-slate-950 md:rounded-2xl overflow-hidden shadow-2xl border border-transparent md:border-slate-800"
              >
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-slate-400">
                  <div className="w-8 h-8 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
                  <p className="text-sm font-medium">Initializing EmulatorJS...</p>
                  <p className="text-xs mt-2 max-w-xs text-center opacity-70">
                    Sila tunggu...
                  </p>
                </div>
                <iframe
                  ref={iframeRef}
                  onLoad={handleIframeLoad}
                  src="/emulator.html"
                  className="w-full h-full relative z-10 bg-transparent border-none"
                  title="Emulator"
                  allow="autoplay; fullscreen; gamepad"
                  sandbox="allow-scripts allow-same-origin allow-downloads"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}