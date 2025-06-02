import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

// FPS Controller Component
const FPSController = ({ levelData, onHit, health, setHealth }) => {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef();
  const [keys, setKeys] = useState({});
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  
  // Movement settings
  const moveSpeed = 10;
  const jumpSpeed = 15;
  const gravity = 30;
  
  const raycaster = useRef(new THREE.Raycaster());
  const [isGrounded, setIsGrounded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeys(prev => ({ ...prev, [event.code]: true }));
    };

    const handleKeyUp = (event) => {
      setKeys(prev => ({ ...prev, [event.code]: false }));
    };

    const handleClick = () => {
      // Shooting mechanics
      if (controlsRef.current?.isLocked) {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        
        raycaster.current.set(camera.position, direction);
        
        // Check for hits on scene objects
        const intersects = raycaster.current.intersectObjects(scene.children, true);
        if (intersects.length > 0 && intersects[0].distance < 50) {
          const hitObject = intersects[0].object;
          console.log('Hit object:', hitObject, 'userData:', hitObject.userData); // Debug log
          if (hitObject.userData.isTarget) {
            onHit(hitObject);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('click', handleClick);
    };
  }, [camera, gl, onHit]);

  useFrame((state, delta) => {
    if (!controlsRef.current?.isLocked) return;

    const controls = controlsRef.current;
    
    // Reset direction
    direction.current.set(0, 0, 0);

    // WASD and Arrow Key movement
    if (keys['KeyW'] || keys['ArrowUp']) direction.current.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) direction.current.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) direction.current.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) direction.current.x += 1;

    // Normalize movement direction
    if (direction.current.length() > 0) {
      direction.current.normalize();
      direction.current.multiplyScalar(moveSpeed * delta);
    }

    // Apply movement relative to camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));

    // Calculate movement
    const movement = new THREE.Vector3();
    movement.addScaledVector(cameraDirection, -direction.current.z);
    movement.addScaledVector(right, direction.current.x);

    // Apply gravity
    if (!isGrounded) {
      velocity.current.y -= gravity * delta;
    }

    // Jumping
    if ((keys['Space'] || keys['KeySpace']) && isGrounded) {
      velocity.current.y = jumpSpeed;
      setIsGrounded(false);
    }

    // Apply movement
    const newPosition = camera.position.clone();
    newPosition.add(movement);
    newPosition.y += velocity.current.y * delta;

    // Simple collision detection and ground check
    const groundRay = new THREE.Raycaster(newPosition, new THREE.Vector3(0, -1, 0));
    const groundIntersects = groundRay.intersectObjects(scene.children, true);
    
    if (groundIntersects.length > 0 && groundIntersects[0].distance < 1.8) {
      newPosition.y = groundIntersects[0].point.y + 1.8;
      velocity.current.y = 0;
      setIsGrounded(true);
    } else {
      setIsGrounded(false);
    }

    // Wall collision detection (simple)
    const wallRay = new THREE.Raycaster(camera.position, movement.normalize());
    const wallIntersects = wallRay.intersectObjects(scene.children, true);
    
    if (wallIntersects.length > 0 && wallIntersects[0].distance < 1) {
      // Don't move if too close to wall
      return;
    }

    camera.position.copy(newPosition);
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
    />
  );
};

// Level Renderer Component
const Level = ({ levelData, onHit }) => {
  if (!levelData || !levelData.objects) return null;

  return (
    <group>
      {levelData.objects.map((obj, index) => {
        const [width, height, depth] = obj.size || [1, 1, 1];
        const [x, y, z] = obj.position || [0, 0, 0];

        return (
          <mesh 
            key={index} 
            position={[x, y, z]}
            userData={{ isTarget: obj.color === '#ff4444' }} // Red boxes are targets
          >
            <boxGeometry args={[width, height, depth]} />
            <meshLambertMaterial color={obj.color || '#888888'} />
          </mesh>
        );
      })}
    </group>
  );
};

// Lighting Component
const Lighting = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
    </>
  );
};

// Main FPS Engine Component
const FPSEngine = ({ levelData, onBackToMenu }) => {
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(30);
  const [score, setScore] = useState(0);

  const handleHit = (hitObject) => {
    // Handle target hits
    if (hitObject.userData.isTarget) {
      setScore(prev => prev + 10);
      setAmmo(prev => Math.max(0, prev - 1));
      
      // Simple hit effect - change color briefly
      const originalColor = hitObject.material.color.clone();
      hitObject.material.color.setHex(0xffffff);
      setTimeout(() => {
        hitObject.material.color.copy(originalColor);
      }, 100);
    }
  };

  const handleEscape = (event) => {
    if (event.code === 'Escape') {
      onBackToMenu();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    // Set spawn position
    if (levelData?.spawn) {
      const camera = document.querySelector('canvas')?.__r3f?.camera;
      if (camera) {
        const [x, y, z] = levelData.spawn.position;
        camera.position.set(x, y, z);
      }
    }
  }, [levelData]);

  return (
    <div className="fps-container">
      <Canvas
        camera={{ position: [0, 1.8, 8], fov: 75 }}
        gl={{ antialias: true }}
        shadows
      >
        <Lighting />
        <Level levelData={levelData} onHit={handleHit} />
        <FPSController 
          levelData={levelData} 
          onHit={handleHit}
          health={health}
          setHealth={setHealth}
        />
      </Canvas>
      
      <div className="fps-ui">
        <div className="crosshair"></div>
        
        <div className="game-hud">
          <div className="health-bar">
            <div 
              className="health-fill" 
              style={{ width: `${health}%` }}
            ></div>
          </div>
          <div className="ammo-display">Ammo: {ammo}</div>
          <div style={{ color: '#ffff00' }}>Score: {score}</div>
        </div>

        <div className="instructions">
          <div>WASD / Arrow Keys: Move</div>
          <div>Mouse: Look Around</div>
          <div>Click: Shoot</div>
          <div>Space: Jump</div>
          <div>ESC: Return to Menu</div>
        </div>
      </div>
    </div>
  );
};

export default FPSEngine;