import React, { useState } from 'react';
import './App.css';
import FPSEngine from './components/FPSEngine';
import MainMenu from './components/MainMenu';

function App() {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'editor'
  const [currentLevel, setCurrentLevel] = useState(null);

  const startGame = (levelData = null) => {
    setCurrentLevel(levelData);
    setGameState('playing');
  };

  const openEditor = () => {
    setGameState('editor');
  };

  const backToMenu = () => {
    setGameState('menu');
    setCurrentLevel(null);
  };

  return (
    <div className="App">
      {gameState === 'menu' && (
        <MainMenu 
          onStartGame={startGame} 
          onOpenEditor={openEditor}
        />
      )}
      {gameState === 'playing' && (
        <FPSEngine 
          levelData={currentLevel}
          onBackToMenu={backToMenu}
        />
      )}
      {gameState === 'editor' && (
        <div className="level-editor">
          <h2>Level Editor (Coming Soon)</h2>
          <button onClick={backToMenu}>Back to Menu</button>
        </div>
      )}
    </div>
  );
}

export default App;