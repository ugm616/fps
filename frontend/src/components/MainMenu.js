import React from 'react';

const MainMenu = ({ onStartGame, onOpenEditor }) => {
  const defaultLevel = {
    name: "Demo Level",
    objects: [
      // Floor
      { type: 'box', position: [0, -2, 0], size: [20, 1, 20], color: '#444' },
      
      // Walls
      { type: 'box', position: [-10, 0, 0], size: [1, 4, 20], color: '#666' },
      { type: 'box', position: [10, 0, 0], size: [1, 4, 20], color: '#666' },
      { type: 'box', position: [0, 0, -10], size: [20, 4, 1], color: '#666' },
      { type: 'box', position: [0, 0, 10], size: [20, 4, 1], color: '#666' },
      
      // Some obstacles
      { type: 'box', position: [-5, 0, -5], size: [2, 2, 2], color: '#ff4444' },
      { type: 'box', position: [5, 0, 5], size: [1.5, 3, 1.5], color: '#44ff44' },
      { type: 'box', position: [0, 0, 0], size: [1, 1, 1], color: '#4444ff' },
      
      // Ceiling
      { type: 'box', position: [0, 5, 0], size: [20, 1, 20], color: '#333' },
    ],
    spawn: { position: [0, 0, 8], rotation: [0, 0, 0] }
  };

  return (
    <div className="main-menu">
      <h1>FPS ENGINE</h1>
      <div className="menu-buttons">
        <button 
          className="menu-button" 
          onClick={() => onStartGame(defaultLevel)}
        >
          Start Demo Game
        </button>
        <button 
          className="menu-button" 
          onClick={onOpenEditor}
        >
          Level Editor (Soon)
        </button>
        <button 
          className="menu-button" 
          onClick={() => alert('Asset Creator coming soon!')}
        >
          Asset Creator (Soon)
        </button>
      </div>
      <div style={{ marginTop: '2rem', opacity: 0.7, fontSize: '0.9rem' }}>
        <p>Use WASD or Arrow Keys to move</p>
        <p>Use Mouse to look around</p>
        <p>Click to shoot</p>
        <p>Press ESC to return to menu</p>
      </div>
    </div>
  );
};

export default MainMenu;