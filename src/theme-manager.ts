import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {getThemeConfig} from './config';

/**
 * Componente de gestión de temas para la aplicación
 * Proporciona cambio dinámico de temas y efectos visuales
 */
@customElement('gdm-theme-manager')
export class ThemeManager extends LitElement {
  @property({type: String}) theme: string = 'neon';
  @property({type: Boolean}) showControls: boolean = true;
  
  @state() private isAnimating: boolean = false;
  @state() private availableThemes: string[] = ['dark', 'neon', 'light', 'futuristic'];
  
  static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }
    
    .theme-controls {
      background: var(--glass-bg, rgba(255, 255, 255, 0.1));
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 16px;
      box-shadow: var(--shadow, 0 8px 32px rgba(0, 0, 0, 0.3));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
      transition: all 0.3s ease;
    }
    
    .theme-controls:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-hover, 0 12px 40px rgba(0, 0, 0, 0.4));
    }
    
    .theme-title {
      color: var(--text-primary, #ffffff);
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
      text-align: center;
    }
    
    .theme-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .theme-button {
      padding: 8px 12px;
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--button-bg, rgba(255, 255, 255, 0.1));
      color: var(--button-text, #ffffff);
      border: 1px solid var(--button-border, rgba(255, 255, 255, 0.2));
    }
    
    .theme-button:hover {
      transform: scale(1.05);
      background: var(--button-hover-bg, rgba(255, 255, 255, 0.2));
    }
    
    .theme-button.active {
      background: var(--button-active-bg, rgba(255, 255, 255, 0.3));
      border-color: var(--button-active-border, rgba(255, 255, 255, 0.5));
      box-shadow: var(--button-active-shadow, 0 0 10px rgba(255, 255, 255, 0.3));
    }
    
    .theme-button.animating {
      animation: pulse 0.6s ease-in-out;
    }
    
    .toggle-controls {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--toggle-bg, rgba(255, 255, 255, 0.2));
      border: none;
      color: var(--toggle-color, #ffffff);
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .toggle-controls:hover {
      transform: scale(1.1);
      background: var(--toggle-hover-bg, rgba(255, 255, 255, 0.3));
    }
    
    .theme-controls.collapsed {
      padding: 8px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .theme-controls.collapsed .theme-title,
    .theme-controls.collapsed .theme-buttons {
      display: none;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    @media (max-width: 768px) {
      :host {
        top: 10px;
        right: 10px;
      }
      
      .theme-controls {
        padding: 12px;
        border-radius: 8px;
      }
      
      .theme-title {
        font-size: 12px;
        margin-bottom: 8px;
      }
      
      .theme-button {
        padding: 6px 10px;
        font-size: 11px;
      }
    }
  `;
  
  connectedCallback() {
    super.connectedCallback();
    this.applyTheme(this.theme);
  }
  
  private applyTheme(theme: string) {
    const themeConfig = getThemeConfig(theme);
    const root = document.documentElement;
    
    // Aplicar variables CSS del tema
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Aplicar variables de tema adicionales
    root.style.setProperty('--glass-bg', themeConfig.effects.glassBackground);
    root.style.setProperty('--shadow', themeConfig.effects.shadow);
    root.style.setProperty('--shadow-hover', themeConfig.effects.shadowHover);
    root.style.setProperty('--border-color', themeConfig.colors.border);
    root.style.setProperty('--text-primary', themeConfig.colors.textPrimary);
    root.style.setProperty('--text-secondary', themeConfig.colors.textSecondary);
    root.style.setProperty('--button-bg', themeConfig.colors.buttonBackground);
    root.style.setProperty('--button-text', themeConfig.colors.buttonText);
    root.style.setProperty('--button-border', themeConfig.colors.buttonBorder);
    root.style.setProperty('--button-hover-bg', themeConfig.colors.buttonHover);
    root.style.setProperty('--button-active-bg', themeConfig.colors.buttonActive);
    root.style.setProperty('--button-active-border', themeConfig.colors.buttonActiveBorder);
    root.style.setProperty('--button-active-shadow', themeConfig.effects.buttonActiveShadow);
    root.style.setProperty('--toggle-bg', themeConfig.colors.toggleBackground);
    root.style.setProperty('--toggle-color', themeConfig.colors.toggleColor);
    root.style.setProperty('--toggle-hover-bg', themeConfig.colors.toggleHover);
    
    // Actualizar atributo data-theme
    document.body.setAttribute('data-theme', theme);
    
    // Emitir evento de cambio de tema
    this.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme, config: themeConfig },
      bubbles: true,
      composed: true
    }));
  }
  
  private handleThemeChange(newTheme: string) {
    if (newTheme === this.theme) return;
    
    this.isAnimating = true;
    this.theme = newTheme;
    this.applyTheme(newTheme);
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }
  
  private toggleControls() {
    this.showControls = !this.showControls;
  }
  
  render() {
    if (!this.showControls) {
      return html`
        <div class="theme-controls collapsed">
          <button class="toggle-controls" @click=${this.toggleControls}>
            🎨
          </button>
        </div>
      `;
    }
    
    return html`
      <div class="theme-controls">
        <button class="toggle-controls" @click=${this.toggleControls}>
          ✕
        </button>
        <div class="theme-title">Tema</div>
        <div class="theme-buttons">
          ${this.availableThemes.map(theme => html`
            <button 
              class="theme-button ${this.theme === theme ? 'active' : ''} ${this.isAnimating ? 'animating' : ''}"
              @click=${() => this.handleThemeChange(theme)}
              title=${theme.charAt(0).toUpperCase() + theme.slice(1)}
            >
              ${theme === 'dark' ? '🌙' : 
                theme === 'neon' ? '⚡' :
                theme === 'light' ? '☀️' : '🚀'}
              ${theme}
            </button>
          `)}
        </div>
      </div>
    `;
  }
}