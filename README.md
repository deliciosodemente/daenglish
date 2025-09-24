# 🎵 Live Audio - Visualización de Audio en Tiempo Real

Una aplicación web interactiva que visualiza audio en tiempo real con efectos 3D impresionantes, integración con IA de Gemini y soporte para múltiples plataformas de despliegue.

## ✨ Características

- 🎨 **Visualización de Audio 3D**: Efectos visuales dinámicos con Three.js
- 🎤 **Análisis en Tiempo Real**: Procesamiento de audio con Web Audio API
- 🤖 **Integración con IA**: Respuestas inteligentes con Google Gemini API
- 🌐 **Despliegue Flexible**: Soporte para Docker, Cloudflare Workers y servidores tradicionales
- 📱 **Diseño Responsivo**: Interfaz moderna con Lit y Web Components
- ⚡ **Alto Rendimiento**: Optimizado con Vite y TypeScript

## 🚀 Tecnologías Utilizadas

- **Frontend**: Lit, TypeScript, Three.js
- **Build**: Vite
- **IA**: Google Gemini API
- **Despliegue**: Docker, Cloudflare Workers, Nginx
- **Audio**: Web Audio API

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- API Key de Google Gemini

## 🔧 Instalación

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/radhikatmosphere/live-audio.git
   cd live-audio
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:
   ```bash
   cp .env.local .env
   # Edita .env con tu GEMINI_API_KEY
   ```

4. **Desarrollo local**:
   ```bash
   npm run dev
   ```

## 🌐 Opciones de Despliegue

### Docker (Recomendado)
```bash
# Construye y ejecuta con Docker
docker-compose up -d
```

### Cloudflare Workers
```bash
# Autentícate con Cloudflare
npx wrangler login

# Despliega
npm run deploy
```

### Servidor Tradicional
```bash
# Construye el proyecto
npm run build

# Sirve los archivos estáticos
npm run start
```

## 📁 Estructura del Proyecto

```
live-audio/
├── src/                    # Código fuente
├── dist/                   # Archivos construidos
├── public/                 # Recursos estáticos
├── docker-compose.yml      # Configuración Docker
├── wrangler.jsonc          # Configuración Cloudflare
├── Dockerfile              # Imagen Docker
└── nginx.conf              # Configuración Nginx
```

## 🔗 Enlaces Importantes

- [Demo en Vivo](https://live-audio.radhikatmosphere.workers.dev)
- [Documentación de Despliegue](DEPLOYMENT.md)
- [Guía Cloudflare](CLOUDFLARE_DEPLOYMENT.md)
- [Changelog](CHANGELOG.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

**Radhika Atmosphere** - Desarrollo y Diseño

## 📞 Contacto

- **Email**: contacto@radhikatmosphere.com
- **Website**: https://radhikatmosphere.com
- **GitHub**: [@radhikatmosphere](https://github.com/radhikatmosphere)

---

⭐ Si te gusta este proyecto, ¡no olvides darle una estrella!
