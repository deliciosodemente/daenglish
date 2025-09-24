/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {getAudioConfig, getVisualConfig, getThemeConfig} from './config';

/**
 * Audio2Face Component - Modelo 3D con rigging facial animado por audio
 */
@customElement('audio2face-visualizer')
export class Audio2FaceVisualizer extends LitElement {
  @property({type: Object}) audioAnalyser!: { getFrequencyData: () => Uint8Array };
  @property({type: Number}) sensitivity = 1.0;
  @property({type: String}) theme = 'default';
  @state() private isLoaded = false;
  @state() private morphTargets: {[key: string]: THREE.Mesh} = {};
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;
  private mixer!: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private animationFrameId?: number;
  private mouthMorphs = ['mouthOpen', 'mouthSmile', 'mouthFrown', 'mouthLeft', 'mouthRight'];
  private eyeMorphs = ['eyeBlinkLeft', 'eyeBlinkRight', 'eyeWideLeft', 'eyeWideRight'];
  private browMorphs = ['browDownLeft', 'browDownRight', 'browUpLeft', 'browUpRight'];

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      background: var(--glass-bg, rgba(255, 255, 255, 0.05));
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: var(--shadow, 0 8px 32px rgba(0, 0, 0, 0.3));
    }
    
    canvas {
      width: 100% !important;
      height: 100% !important;
      display: block;
      border-radius: 16px;
    }
    
    .info-overlay {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: 'Courier New', monospace;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      z-index: 10;
      animation: fadeIn 0.5s ease-out;
    }
    
    .face-status {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.7);
      color: var(--accent-color, #64b5f6);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      z-index: 10;
      animation: fadeIn 0.5s ease-out 0.2s both;
    }
    
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      font-size: 1.1rem;
      z-index: 20;
      border-radius: 16px;
      backdrop-filter: blur(5px);
    }
    
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid var(--accent-color, #64b5f6);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .controls {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 10px;
      z-index: 20;
    }
    
    .control-btn {
      background: var(--secondary-bg, rgba(255, 255, 255, 0.1));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
      color: var(--text-primary, white);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 16px;
    }
    
    .control-btn:hover {
      background: var(--accent-color, #64b5f6);
      transform: scale(1.1);
      box-shadow: 0 0 15px var(--glow-color, rgba(100, 181, 246, 0.5));
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    const visualConfig = getVisualConfig();
    this.initScene();
    this.createGenericFaceModel();
    if (visualConfig.animation.autoStart) {
      this.startAnimation();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initScene() {
    const themeConfig = getThemeConfig(this.theme);
    const visualConfig = getVisualConfig();
    
    // Crear escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(themeConfig.colors.background);

    // Crear cámara
    this.camera = new THREE.PerspectiveCamera(
      visualConfig.camera.fov,
      this.clientWidth / this.clientHeight,
      visualConfig.camera.near,
      visualConfig.camera.far
    );
    this.camera.position.set(
      visualConfig.camera.position.x,
      visualConfig.camera.position.y,
      visualConfig.camera.position.z
    );

    // Crear renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: visualConfig.renderer.antialias, 
      alpha: visualConfig.renderer.alpha,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(this.clientWidth, this.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = visualConfig.renderer.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Añadir iluminación
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color(themeConfig.colors.ambientLight),
      visualConfig.lighting.ambientIntensity
    );
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      new THREE.Color(themeConfig.colors.directionalLight),
      visualConfig.lighting.directionalIntensity
    );
    directionalLight.position.set(
      visualConfig.lighting.directionalPosition.x,
      visualConfig.lighting.directionalPosition.y,
      visualConfig.lighting.directionalPosition.z
    );
    directionalLight.castShadow = visualConfig.lighting.shadows;
    if (visualConfig.lighting.shadows) {
      directionalLight.shadow.mapSize.width = visualConfig.lighting.shadowMapSize;
      directionalLight.shadow.mapSize.height = visualConfig.lighting.shadowMapSize;
    }
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(
      new THREE.Color(themeConfig.colors.pointLight),
      visualConfig.lighting.pointIntensity,
      visualConfig.lighting.pointDistance
    );
    pointLight.position.set(
      visualConfig.lighting.pointPosition.x,
      visualConfig.lighting.pointPosition.y,
      visualConfig.lighting.pointPosition.z
    );
    this.scene.add(pointLight);

    // Añadir renderer al DOM
    this.shadowRoot!.appendChild(this.renderer.domElement);

    // Manejar resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private createGenericFaceModel() {
    // Crear un modelo genérico de cabeza humana con morph targets para audio2face
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const visualConfig = getVisualConfig();
    const themeConfig = getThemeConfig(this.theme);
    
    // Crear morph targets para expresiones faciales
    const positions = headGeometry.attributes.position.array as Float32Array;
    const morphTargets = [];

    // Morph target: boca abierta
    const mouthOpenPositions = new Float32Array(positions.length);
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      mouthOpenPositions[i] = x;
      mouthOpenPositions[i + 1] = y;
      mouthOpenPositions[i + 2] = z;
      
      // Mover la parte inferior de la cara hacia abajo (simulando boca abierta)
      if (y < -0.2) {
        mouthOpenPositions[i + 1] = y - visualConfig.morphTargets.mouthOpenStrength;
        mouthOpenPositions[i + 2] = z + visualConfig.morphTargets.mouthOpenForward;
      }
    }
    morphTargets.push({ name: 'mouthOpen', array: mouthOpenPositions });

    // Morph target: sonrisa
    const smilePositions = new Float32Array(positions.length);
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      smilePositions[i] = x;
      smilePositions[i + 1] = y;
      smilePositions[i + 2] = z;
      
      // Elevar las comisuras de la boca
      if (Math.abs(x) > 0.6 && y > -0.3 && y < 0.1) {
        smilePositions[i + 1] = y + visualConfig.morphTargets.smileHeight;
        smilePositions[i + 2] = z + visualConfig.morphTargets.smileForward;
      }
    }
    morphTargets.push({ name: 'mouthSmile', array: smilePositions });

    // Añadir morph targets al geometry
    for (const target of morphTargets) {
      headGeometry.morphAttributes[target.name] = new THREE.BufferAttribute(target.array, 3);
    }

    // Crear material con skinning y morph targets
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(themeConfig.colors.primary),
      roughness: visualConfig.materials.roughness,
      metalness: visualConfig.materials.metalness,
      morphTargets: true,
      morphNormals: true
    });

    // Crear mesh con morph targets
    this.model = new THREE.Group();
    const headMesh = new THREE.Mesh(headGeometry, material);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    this.model.add(headMesh);

    // Añadir ojos
    const eyeGeometry = new THREE.SphereGeometry(visualConfig.eyes.size, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(themeConfig.colors.accent) 
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-visualConfig.eyes.spacing, visualConfig.eyes.height, visualConfig.eyes.depth);
    leftEye.castShadow = true;
    this.model.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(visualConfig.eyes.spacing, visualConfig.eyes.height, visualConfig.eyes.depth);
    rightEye.castShadow = true;
    this.model.add(rightEye);

    // Añadir pupilas
    const pupilGeometry = new THREE.SphereGeometry(visualConfig.eyes.pupilSize, 8, 8);
    const pupilMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(themeConfig.colors.pupil) 
    });
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(0, 0, visualConfig.eyes.pupilDepth);
    leftEye.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0, 0, visualConfig.eyes.pupilDepth);
    rightEye.add(rightPupil);

    // Añadir cejas
    const browGeometry = new THREE.BoxGeometry(
      visualConfig.eyebrows.width, 
      visualConfig.eyebrows.height, 
      visualConfig.eyebrows.depth
    );
    const browMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(themeConfig.colors.secondary) 
    });
    
    const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
    leftBrow.position.set(-visualConfig.eyebrows.spacing, visualConfig.eyebrows.height, visualConfig.eyebrows.depth);
    leftBrow.castShadow = true;
    this.model.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
    rightBrow.position.set(visualConfig.eyebrows.spacing, visualConfig.eyebrows.height, visualConfig.eyebrows.depth);
    rightBrow.castShadow = true;
    this.model.add(rightBrow);

    // Añadir modelo a la escena
    this.scene.add(this.model);
    
    // Configurar morph targets
    this.setupMorphTargets(headMesh);
    
    this.isLoaded = true;
    this.startAnimation();
  }

  private setupMorphTargets(mesh: THREE.Mesh) {
    // Guardar referencias a los morph targets para animación
    this.morphTargets['head'] = mesh;
    
    // Inicializar valores de morph targets
    for (let i = 0; i < mesh.geometry.morphAttributes.mouthOpen.count; i++) {
      mesh.morphTargetInfluences[i] = 0;
    }
  }

  private startAnimation() {
    this.animationLoop();
  }

  private animationLoop() {
    this.animationFrameId = requestAnimationFrame(() => this.animationLoop());
    
    const delta = this.clock.getDelta();
    const visualConfig = getVisualConfig();
    
    if (this.mixer) {
      this.mixer.update(delta);
    }
    
    // Actualizar animación facial basada en audio
    this.updateFacialAnimation();
    
    // Rotar modelo suavemente
    if (this.model && visualConfig.animation.idleAnimation) {
      this.model.rotation.y += visualConfig.animation.rotationSpeed;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  private updateFacialAnimation() {
    if (!this.audioAnalyser || !this.isLoaded) return;
    
    const frequencyData = this.audioAnalyser.getFrequencyData();
    const headMesh = this.morphTargets['head'] as THREE.Mesh;
    const audioConfig = getAudioConfig();
    const visualConfig = getVisualConfig();
    
    if (!headMesh || !headMesh.morphTargetInfluences) return;
    
    // Analizar diferentes rangos de frecuencia
    const bassRange = this.getFrequencyRange(frequencyData, ...audioConfig.frequencyRanges.bass);
    const midRange = this.getFrequencyRange(frequencyData, ...audioConfig.frequencyRanges.mid);
    const trebleRange = this.getFrequencyRange(frequencyData, ...audioConfig.frequencyRanges.treble);
    
    // Normalizar valores con sensibilidad configurada
    const bassIntensity = bassRange / 255 * this.sensitivity * audioConfig.sensitivity;
    const midIntensity = midRange / 255 * this.sensitivity * audioConfig.sensitivity;
    const trebleIntensity = trebleRange / 255 * this.sensitivity * audioConfig.sensitivity;
    
    // Aplicar morph targets basados en frecuencias
    // Bajo: abre la boca
    if (headMesh.morphTargetInfluences[0] !== undefined) {
      headMesh.morphTargetInfluences[0] = Math.min(bassIntensity * visualConfig.morphTargets.mouthOpen, 1);
    }
    
    // Medios: sonrisa
    if (headMesh.morphTargetInfluences[1] !== undefined) {
      headMesh.morphTargetInfluences[1] = Math.min(midIntensity * visualConfig.morphTargets.mouthSmile, 1);
    }
    
    // Agudos: parpadeo de ojos
    const eyes = this.model.children.filter(child => 
      child.name.includes('eye') || child.position.z > 0.5
    );
    eyes.forEach(eye => {
      if (trebleIntensity > visualConfig.morphTargets.eyeBlink) {
        eye.scale.y = 0.1; // Parpadear
      } else {
        eye.scale.y = 1; // Abrir ojo
      }
    });
  }

  private getFrequencyRange(data: Uint8Array, startFreq: number, endFreq: number): number {
    const startIndex = Math.floor(startFreq / 22050 * data.length);
    const endIndex = Math.floor(endFreq / 22050 * data.length);
    let sum = 0;
    let count = 0;
    
    for (let i = startIndex; i < endIndex && i < data.length; i++) {
      sum += data[i];
      count++;
    }
    
    return count > 0 ? sum / count : 0;
  }

  private onWindowResize() {
    if (!this.camera || !this.renderer) return;
    
    this.camera.aspect = this.clientWidth / this.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.clientWidth, this.clientHeight);
  }

  render() {
    const audioConfig = getAudioConfig();
    const visualConfig = getVisualConfig();
    
    return html`
      <canvas></canvas>
      
      ${!this.isLoaded ? html`
        <div class="loading-overlay">
          <div class="loading-spinner"></div>
          <span>Loading 3D Face Model...</span>
        </div>
      ` : html`
        <div class="info-overlay">
          <div>🎤 Audio2Face Visualizer</div>
          <div>Sensitivity: ${this.sensitivity.toFixed(1)}</div>
          <div>Theme: ${this.theme}</div>
        </div>
        
        <div class="face-status">
          ${this.audioAnalyser ? '● LIVE' : '● IDLE'}
        </div>
      `}
      
      <div class="controls">
        <button class="control-btn" @click=${() => this.resetCamera()} title="Reset Camera">
          🎯
        </button>
        <button class="control-btn" @click=${() => this.toggleTheme()} title="Toggle Theme">
          🎨
        </button>
      </div>
    `;
  }

  private resetCamera() {
    if (this.camera) {
      this.camera.position.set(0, 0, 3);
      this.camera.lookAt(0, 0, 0);
    }
  }

  private toggleTheme() {
    const themes = ['default', 'light', 'neon', 'futuristic'];
    const currentIndex = themes.indexOf(this.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.theme = themes[nextIndex];
    this.setAttribute('data-theme', this.theme);
  }
}