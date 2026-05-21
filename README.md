# ✉️ AI Mail Assistant

> Redacción inteligente de correos profesionales con IA local

![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![Ollama](https://img.shields.io/badge/Ollama-gemma:2b-000000?logo=ollama&logoColor=white)

---

## 📋 Descripción

**AI Mail Assistant** es una aplicación web que utiliza inteligencia artificial local para generar correos profesionales de forma automática. El usuario describe brevemente lo que necesita comunicar, selecciona el tono deseado, y la IA redacta un correo completo con asunto, saludo, cuerpo y despedida.

Desarrollado como solución al reto académico **"Transforma una Industria con IA"** en [Riwi.io](https://riwi.io).

---

## 👥 Integrantes

- Jorge Carmona
- Camilo Ramirez
- Julian Valenzuela

---

## 🏭 Industria

**Comunicación empresarial**

---

## ❗ Problemática

Redactar correos profesionales de forma efectiva consume tiempo valioso en entornos empresariales. Muchos profesionales no cuentan con las habilidades para adaptar el tono y el contenido según el contexto, lo que puede generar malentendidos o una imagen corporativa inconsistente.

---

## 💡 Solución

Una aplicación web que genera correos profesionales mediante IA local, completamente offline, sin depender de APIs externas ni exponer datos sensibles.

**Funcionalidades:**
- 8 tonos disponibles: formal, amigable, profesional, persuasivo, empático, directo, conciliador y urgente
- Historial de correos generados con persistencia local
- Renderizado de formato Markdown en las respuestas
- Exportación en TXT y PDF
- Funciona 100% offline con IA local mediante Ollama y gemma:2b

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| [Vite](https://vitejs.dev) | Entorno de desarrollo |
| JavaScript Vanilla | Lógica de la aplicación |
| [Ollama](https://ollama.com) | Servidor de IA local |
| gemma:2b | Modelo de lenguaje |
| [jsPDF](https://github.com/parallax/jsPDF) | Exportación a PDF |

---

## 🚀 Instalación y uso

### Prerrequisitos

- [Node.js](https://nodejs.org) v18 o superior
- [Ollama](https://ollama.com) instalado en tu sistema

### 1. Clonar el repositorio

```bash
git clone https://github.com/Envy528/AI-Mail-Assistant.git
cd AI-Mail-Assistant/

```

### 2. Instalar el modelo de IA

```bash
ollama run gemma:2b
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar el proyecto

```bash
npm run dev
```

### 5. Abrir en el navegador

```
http://localhost:5173
```

> ⚠️ Ollama debe estar corriendo en segundo plano antes de iniciar el proyecto.

---

## 📁 Estructura del proyecto

```
ai-mail-assistant/
├── src/
│   ├── main.js       # Lógica principal y renderizado de la UI
│   └── style.css     # Estilos de la aplicación
├── index.html        # Punto de entrada HTML
├── package.json      # Dependencias y scripts
└── README.md
```

---
