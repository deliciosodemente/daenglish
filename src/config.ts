/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppConfig {
  themes: {
    [key: string]: {
      name: string;
      colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        shadow: string;
        glow: string;
        ambientLight: string;
        directionalLight: string;
        pointLight: string;
        pupil: string;
        buttonBackground: string;
        buttonText: string;
        buttonBorder: string;
        buttonHover: string;
        buttonActive: string;
        buttonActiveBorder: string;
        toggleBackground: string;
        toggleColor: string;
        toggleHover: string;
        textPrimary: string;
      };
      effects: {
        blur: number;
        opacity: number;
        saturation: number;
        brightness: number;
        glassBackground: string;
        shadow: string;
        shadowHover: string;
        buttonActiveShadow: string;
      };
    };
  };
  audio: {
    sampleRate: number;
    bufferSize: number;
    smoothingTimeConstant: number;
    fftSize: number;
    sensitivity: number;
    frequencyRanges: {
      bass: [number, number];
      mid: [number, number];
      treble: [number, number];
    };
  };
  visual: {
    morphTargets: {
      mouthOpen: number;
      mouthSmile: number;
      eyeBlink: number;
      browMove: number;
      mouthOpenStrength: number;
      mouthOpenForward: number;
      smileHeight: number;
      smileForward: number;
      spacing: number;
      height: number;
      depth: number;
    };
    animation: {
      rotationSpeed: number;
      transitionSpeed: number;
      idleAnimation: boolean;
      autoStart: boolean;
    };
    camera: {
      fov: number;
      near: number;
      far: number;
      position: {
        x: number;
        y: number;
        z: number;
      };
    };
    renderer: {
      antialias: boolean;
      alpha: boolean;
      shadows: boolean;
    };
    lighting: {
      ambientIntensity: number;
      directionalIntensity: number;
      pointIntensity: number;
      pointDistance: number;
      shadows: boolean;
      shadowMapSize: number;
      directionalPosition: {
        x: number;
        y: number;
        z: number;
      };
      pointPosition: {
        x: number;
        y: number;
        z: number;
      };
    };
    eyebrows: {
      spacing: number;
      height: number;
      depth: number;
      width: number;
    };
    materials: {
      roughness: number;
      metalness: number;
      emissiveIntensity: number;
    };
    eyes: {
      size: number;
      spacing: number;
      height: number;
      depth: number;
      pupilSize: number;
      pupilDepth: number;
    };
    smile: {
      height: number;
      forward: number;
    };
  };
}

export const defaultConfig: AppConfig = {
  themes: {
    dark: {
      name: 'Dark',
      colors: {
        primary: '#1a1a2e',
        secondary: '#16213e',
        accent: '#0f3460',
        background: '#0f0f23',
        surface: 'rgba(255, 255, 255, 0.1)',
        text: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.7)',
        border: 'rgba(255, 255, 255, 0.2)',
        shadow: 'rgba(0, 0, 0, 0.5)',
        glow: 'rgba(100, 181, 246, 0.5)',
        ambientLight: '#404040',
        directionalLight: '#ffffff',
        pointLight: '#64b5f6',
        pupil: '#000000',
        buttonBackground: '#0f3460',
        buttonText: '#ffffff',
        buttonBorder: 'rgba(255, 255, 255, 0.3)',
        buttonHover: '#16213e',
        buttonActive: '#1a1a2e',
        buttonActiveBorder: 'rgba(255, 255, 255, 0.5)',
        toggleBackground: '#16213e',
        toggleColor: '#64b5f6',
        toggleHover: '#0f3460',
        textPrimary: '#ffffff'
      },
      effects: {
        blur: 10,
        opacity: 0.1,
        saturation: 1.2,
        brightness: 1.1,
        glassBackground: 'rgba(255, 255, 255, 0.1)',
        shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        shadowHover: '0 12px 40px rgba(0, 0, 0, 0.4)',
        buttonActiveShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
      }
    },
    neon: {
      name: 'Neon',
      colors: {
        primary: '#0a0a0a',
        secondary: '#1a1a1a',
        accent: '#00ff88',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        surface: 'rgba(0, 255, 136, 0.1)',
        text: '#00ff88',
        textSecondary: 'rgba(0, 255, 136, 0.7)',
        border: 'rgba(0, 255, 136, 0.3)',
        shadow: 'rgba(0, 255, 136, 0.3)',
        glow: 'rgba(0, 255, 136, 0.8)',
        ambientLight: '#202020',
        directionalLight: '#00ff88',
        pointLight: '#00ff88',
        pupil: '#000000',
        buttonBackground: '#00ff88',
        buttonText: '#0a0a0a',
        buttonBorder: 'rgba(0, 255, 136, 0.5)',
        buttonHover: '#00cc6a',
        buttonActive: '#00ff88',
        buttonActiveBorder: 'rgba(0, 255, 136, 0.8)',
        toggleBackground: '#1a1a1a',
        toggleColor: '#00ff88',
        toggleHover: '#00cc6a',
        textPrimary: '#00ff88'
      },
      effects: {
        blur: 15,
        opacity: 0.15,
        saturation: 1.5,
        brightness: 1.3,
        glassBackground: 'rgba(0, 255, 136, 0.1)',
        shadow: '0 8px 32px rgba(0, 255, 136, 0.3)',
        shadowHover: '0 12px 40px rgba(0, 255, 136, 0.4)',
        buttonActiveShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
      }
    },
    light: {
      name: 'Light',
      colors: {
        primary: '#f8f9fa',
        secondary: '#e9ecef',
        accent: '#007bff',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        surface: 'rgba(0, 0, 0, 0.05)',
        text: '#212529',
        textSecondary: 'rgba(33, 37, 41, 0.7)',
        border: 'rgba(0, 0, 0, 0.1)',
        shadow: 'rgba(0, 0, 0, 0.1)',
        glow: 'rgba(0, 123, 255, 0.3)',
        ambientLight: '#ffffff',
        directionalLight: '#007bff',
        pointLight: '#17a2b8',
        pupil: '#000000',
        buttonBackground: '#007bff',
        buttonText: '#ffffff',
        buttonBorder: 'rgba(0, 123, 255, 0.3)',
        buttonHover: '#0056b3',
        buttonActive: '#007bff',
        buttonActiveBorder: 'rgba(0, 123, 255, 0.5)',
        toggleBackground: '#e9ecef',
        toggleColor: '#007bff',
        toggleHover: '#0056b3',
        textPrimary: '#212529'
      },
      effects: {
        blur: 5,
        opacity: 0.05,
        saturation: 1,
        brightness: 1,
        glassBackground: 'rgba(0, 0, 0, 0.05)',
        shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        shadowHover: '0 12px 40px rgba(0, 0, 0, 0.15)',
        buttonActiveShadow: '0 0 10px rgba(0, 123, 255, 0.3)'
      }
    },
    futuristic: {
      name: 'Futuristic',
      colors: {
        primary: '#001122',
        secondary: '#002244',
        accent: '#00ffff',
        background: 'linear-gradient(135deg, #001122 0%, #003366 50%, #002244 100%)',
        surface: 'rgba(0, 255, 255, 0.1)',
        text: '#00ffff',
        textSecondary: 'rgba(0, 255, 255, 0.7)',
        border: 'rgba(0, 255, 255, 0.3)',
        shadow: 'rgba(0, 255, 255, 0.2)',
        glow: 'rgba(0, 255, 255, 0.6)',
        ambientLight: '#003366',
        directionalLight: '#00ffff',
        pointLight: '#00ffff',
        pupil: '#000000',
        buttonBackground: '#00ffff',
        buttonText: '#001122',
        buttonBorder: 'rgba(0, 255, 255, 0.5)',
        buttonHover: '#00cccc',
        buttonActive: '#00ffff',
        buttonActiveBorder: 'rgba(0, 255, 255, 0.8)',
        toggleBackground: '#002244',
        toggleColor: '#00ffff',
        toggleHover: '#00cccc',
        textPrimary: '#00ffff'
      },
      effects: {
        blur: 20,
        opacity: 0.2,
        saturation: 1.8,
        brightness: 1.4,
        glassBackground: 'rgba(0, 255, 255, 0.1)',
        shadow: '0 8px 32px rgba(0, 255, 255, 0.2)',
        shadowHover: '0 12px 40px rgba(0, 255, 255, 0.3)',
        buttonActiveShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
      }
    }
  },
  audio: {
    sampleRate: 16000,
    bufferSize: 256,
    smoothingTimeConstant: 0.8,
    fftSize: 256,
    sensitivity: 1.2,
    frequencyRanges: {
      bass: [0, 60],
      mid: [60, 2500],
      treble: [2500, 8000]
    }
  },
  visual: {
    morphTargets: {
      mouthOpen: 2.0,
      mouthSmile: 1.5,
      eyeBlink: 0.7,
      browMove: 0.5,
      mouthOpenStrength: 0.3,
      mouthOpenForward: 0.1,
      smileHeight: 0.1,
      smileForward: 0.05,
      spacing: 0.6,
      height: 0.8,
      depth: 0.9
    },
    animation: {
      rotationSpeed: 0.005,
      transitionSpeed: 0.1,
      idleAnimation: true,
      autoStart: true
    },
    camera: {
      fov: 75,
      near: 0.1,
      far: 1000,
      position: {
        x: 0,
        y: 0,
        z: 3
      }
    },
    renderer: {
      antialias: true,
      alpha: true,
      shadows: true
    },
    lighting: {
      ambientIntensity: 0.4,
      directionalIntensity: 0.8,
      pointIntensity: 0.5,
      pointDistance: 10,
      shadows: true,
      shadowMapSize: 1024,
      directionalPosition: {
        x: 5,
        y: 5,
        z: 5
      },
      pointPosition: {
        x: -5,
        y: 3,
        z: 2
      }
    },
    eyebrows: {
      spacing: 0.6,
      height: 0.8,
      depth: 0.9,
      width: 0.8
    },
    materials: {
      roughness: 0.3,
      metalness: 0.1,
      emissiveIntensity: 0.1
    },
    eyes: {
      size: 0.15,
      spacing: 0.3,
      height: 0.1,
      depth: 0.8,
      pupilSize: 0.08,
      pupilDepth: 0.02
    },
    smile: {
      height: 0.1,
      forward: 0.05
    }
  }
};

export function getThemeConfig(themeName: string) {
  return defaultConfig.themes[themeName] || defaultConfig.themes.dark;
}

export function getAudioConfig() {
  return defaultConfig.audio;
}

export function getVisualConfig() {
  return defaultConfig.visual;
}