# 🤝 Contribuir a Live Audio

¡Gracias por tu interés en contribuir a Live Audio! Esta guía te ayudará a comenzar.

## 📋 Índice

- [Código de Conducta](#código-de-conducta)
- [Cómo Empezar](#cómo-empezar)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Pull Requests](#pull-requests)
- [Estilo de Código](#estilo-de-código)

## 📜 Código de Conducta

Al contribuir a este proyecto, aceptas adherirte a nuestro Código de Conducta. Por favor, sé respetuoso y constructivo en todas las interacciones.

## 🚀 Cómo Empezar

1. **Fork el repositorio** en GitHub
2. **Clona tu fork** localmente:
   ```bash
   git clone https://github.com/tu-usuario/live-audio.git
   cd live-audio
   ```
3. **Instala las dependencias**:
   ```bash
   npm install
   ```
4. **Crea una rama** para tu feature o fix:
   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```

## 🐛 Reportar Bugs

Antes de reportar un bug:
- ✅ Busca en los issues existentes para ver si ya fue reportado
- ✅ Asegúrate de estar usando la última versión

Para reportar un bug:
1. Ve a [Issues](https://github.com/radhikatmosphere/live-audio/issues)
2. Crea un nuevo issue con el template de bug
3. Proporciona:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es relevante
   - Información del sistema (OS, navegador, versión)

## 💡 Sugerir Mejoras

¡Las sugerencias son bienvenidas! Para sugerir mejoras:
1. Ve a [Issues](https://github.com/radhikatmosphere/live-audio/issues)
2. Usa el template de feature request
3. Describe:
   - La mejora propuesta
   - Por qué sería útil
   - Posible implementación

## 🔄 Pull Requests

### Proceso

1. **Actualiza tu fork**:
   ```bash
   git remote add upstream https://github.com/radhikatmosphere/live-audio.git
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Crea tu feature branch**:
   ```bash
   git checkout -b feature/mi-caracteristica
   ```

3. **Haz tus cambios** siguiendo las [mejores prácticas](#estilo-de-código)

4. **Testea tus cambios**:
   ```bash
   npm run build
   npm run dev
   ```

5. **Commit tus cambios**:
   ```bash
   git add .
   git commit -m "feat: agrega nueva característica"
   ```

6. **Push a tu fork**:
   ```bash
   git push origin feature/mi-caracteristica
   ```

7. **Crea un Pull Request** en GitHub

### Convenciones de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (espacios, comas, etc)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en build, herramientas, etc

Ejemplos:
```
feat: agrega visualización de ondas 3D
fix: corrige error en análisis de frecuencias
docs: actualiza README con nuevas instrucciones
```

## 🎨 Estilo de Código

### TypeScript/JavaScript
- Usa TypeScript para nuevo código
- Sigue las reglas del `tsconfig.json`
- Usa nombres descriptivos para variables y funciones
- Comenta código complejo
- Mantén funciones pequeñas y enfocadas

### CSS
- Usa CSS Modules o Styled Components
- Mantén consistencia en nombres de clases
- Usa variables CSS para colores y tamaños

### Componentes
- Sigue las mejores prácticas de Lit
- Usa TypeScript para props y eventos
- Documenta componentes públicos

## 🧪 Testing

Actualmente estamos implementando tests. Próximamente:
- Unit tests con Jest
- Integration tests
- E2E tests con Playwright

## 📚 Recursos

- [Documentación de Lit](https://lit.dev/docs/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

## ❓ Preguntas

¿Tienes preguntas? Únete a nuestras discusiones en [GitHub Discussions](https://github.com/radhikatmosphere/live-audio/discussions)

---

¡Gracias por contribuir! 🎉