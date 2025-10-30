import * as THREE from '../three/three.module.js';
import { TetrisGame } from './TetrisGame.js';
import { IdleScene } from '../scenes/IdleScene.js';
import { GameStateManager } from '../managers/GameStateManager.js';

// ==================== MAIN APPLICATION ====================
export class App {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.scene = new THREE.Scene();
        
        // Cámara ortográfica para vista 2D
        const aspect = 900 / 1200;
        const frustumSize = 8;
        this.camera = new THREE.OrthographicCamera(
            -frustumSize * aspect, frustumSize * aspect,
            frustumSize, -frustumSize,
            0.1, 1000
        );
        
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        
        // Create game first (needed by idle scene)
        this.tetrisGame = new TetrisGame(this.scene, this.camera);
        window.tetrisGame = this.tetrisGame;
        
        // Create idle scene (needs tetrisGame reference)
        this.idleScene = new IdleScene(this.scene, this.camera, this.tetrisGame);
        window.idleScene = this.idleScene;
        
        // Create state manager
        this.gameStateManager = new GameStateManager(this.idleScene);
        window.gameStateManager = this.gameStateManager;
        
        // Input
        this.setupInput();
        
        // Animation loop
        this.clock = new THREE.Clock();
        this.animate();
    }
    
    setupRenderer() {
        this.renderer.setSize(900, 1200);
        this.renderer.setClearColor(0x000000);
    }
    
    setupCamera() {
        this.camera.position.z = 10;
        this.camera.position.y = -8;
        this.camera.position.x = 0;
        this.camera.updateProjectionMatrix();
    }
    
    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);
        
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
        frontLight.position.set(0, 0, 10);
        this.scene.add(frontLight);
    }
    
    setupInput() {
        document.addEventListener('keydown', (event) => {
            if (this.tetrisGame) {
                this.tetrisGame.handleInput(event.key);
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        if (this.idleScene) {
            this.idleScene.update(deltaTime);
        }
        
        if (this.tetrisGame) {
            this.tetrisGame.update(deltaTime);
        }
        
        if (this.gameStateManager) {
            this.gameStateManager.update(deltaTime);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}
