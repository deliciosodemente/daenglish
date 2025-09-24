# 🚀 Guía de Configuración del Repositorio

Esta guía te ayudará a crear el repositorio en la organización `radhikatmosphere` y hacer el primer commit.

## 📋 Requisitos Previos

1. **GitHub CLI (gh)** instalado
   - Descarga desde: https://cli.github.com/
   - Verifica instalación: `gh --version`

2. **Ser miembro de la organización** `radhikatmosphere`
   - Contacta al administrador de la organización
   - Acepta la invitación en tu email

3. **Autenticación con GitHub**
   ```bash
   gh auth login
   ```

## 🎯 Pasos para Crear el Repositorio

### Opción 1: Script Automático (Recomendado)

#### En Unix/Linux/Mac:
```bash
# Haz el script ejecutable
chmod +x setup-github-repo.sh

# Ejecuta el script
./setup-github-repo.sh
```

#### En Windows:
```cmd
# Ejecuta el script
setup-github-repo.bat
```

### Opción 2: Manual

1. **Crear el repositorio en GitHub**:
   ```bash
   gh repo create radhikatmosphere/live-audio \
     --public \
     --description "Visualización interactiva de audio en tiempo real con efectos 3D y IA" \
     --homepage "https://radhikatmosphere.com" \
     --disable-wiki \
     --disable-issues
   ```

2. **Agregar el remote y hacer push**:
   ```bash
   git remote add origin https://github.com/radhikatmosphere/live-audio.git
   git branch -M main
   git push -u origin main
   ```

## 🔧 Configuración Adicional

### 1. Configurar GitHub Actions Secrets

Para el despliegue automático a Cloudflare Workers, configura estos secrets:

- **CLOUDFLARE_API_TOKEN**: Tu token de API de Cloudflare
- **CLOUDFLARE_ACCOUNT_ID**: Tu ID de cuenta de Cloudflare

```bash
# Obtén tu Account ID
gh secret set CLOUDFLARE_ACCOUNT_ID --repo radhikatmosphere/live-audio

# Obtén tu API Token desde Cloudflare dashboard
gh secret set CLOUDFLARE_API_TOKEN --repo radhikatmosphere/live-audio
```

### 2. Configurar Variables de Entorno

Configura las variables de entorno en el repositorio:

```bash
gh variable set GEMINI_API_KEY --repo radhikatmosphere/live-audio --body "tu-api-key-aqui"
```

### 3. Habilitar Issues y Discusiones

Si deseas habilitar Issues y Discusiones:

```bash
gh repo edit radhikatmosphere/live-audio --enable-issues --enable-discussions
```

## 📊 Verificar el Repositorio

Después de crear el repositorio, verifica:

1. **Accede al repositorio**:
   ```bash
   gh repo view radhikatmosphere/live-audio --web
   ```

2. **Verifica el contenido**:
   ```bash
   git ls-remote origin
   ```

3. **Comprueba los archivos**:
   ```bash
   gh api repos/radhikatmosphere/live-audio/contents --jq '.[].name'
   ```

## 🚨 Solución de Problemas

### Error: "Repository already exists"
El repositorio ya existe. Usa un nombre diferente o elimina el existente.

### Error: "Not a member of organization"
No eres miembro de `radhikatmosphere`. Contacta al administrador.

### Error: "Authentication failed"
Autentícate nuevamente:
```bash
gh auth login
```

### Error: "Permission denied"
Verifica que tienes permisos para crear repositorios en la organización.

## 🎉 ¡Éxito!

Una vez completados estos pasos, tu repositorio estará disponible en:
**https://github.com/radhikatmosphere/live-audio**

El código inicial incluye:
- ✅ Aplicación completa de visualización de audio
- ✅ Soporte para Docker y Cloudflare Workers
- ✅ Documentación completa
- ✅ Scripts de despliegue
- ✅ GitHub Actions para CI/CD

## 📞 Soporte

¿Problemas? Contacta al equipo de Radhika Atmosphere o crea un issue en el repositorio.