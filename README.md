# 🚀 EBV03 - Frontend: Plataforma de Gestión

¡Bienvenido al repositorio frontend de **EBV03**! Esta es una aplicación moderna construida con **React 19** y **Vite**, diseñada para ofrecer una experiencia de usuario fluida, rápida y profesional.

---

## 🛠️ Tecnologías Principales

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Peticiones HTTP:** [Axios](https://axios-http.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Estilos:** CSS Vanilla (Modular & Professional Design)

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura **basada en características (Feature-based)** para mantener el código escalable y organizado.

```text
src/
├── assets/             # Imágenes, SVGs y recursos estáticos.
├── features/           # Módulos principales de la aplicación.
│   ├── auth/           # Lógica de autenticación (Login, Registro).
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   └── home/           # Dashboard y vista principal.
├── shared/             # Código reutilizable en toda la app.
│   ├── components/     # UI Components (Botones, Inputs, Modales).
│   ├── hooks/          # Custom hooks globales.
│   └── utils/          # Helpers y funciones de utilidad.
├── App.jsx             # Configuración de rutas y proveedores.
├── main.jsx            # Punto de entrada de la aplicación.
└── index.css           # Estilos globales y tokens de diseño.
```

---

## 🚀 Inicio Rápido

Sigue estos pasos para ejecutar el proyecto localmente:

### 1. Requisitos Previos
- Node.js (v18 o superior recomendado)
- npm o yarn

### 2. Instalación
Clona el repositorio y ejecuta:
```bash
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y configura la URL de la API:
```env
VITE_API_URL=http://localhost:8000/api
```

### 4. Ejecución en Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con HMR.
- `npm run build`: Compila la aplicación para producción en la carpeta `dist/`.
- `npm run lint`: Ejecuta ESLint para asegurar la calidad del código.
- `npm run preview`: Previsualiza la compilación de producción localmente.

---

## 🎨 Principios de Diseño

- **Componentización:** Reutilización máxima de componentes en `shared/`.
- **Clean Architecture:** Separación clara entre la lógica de negocio (hooks/services) y la presentación (JSX).
- **Responsive Design:** Interfaces adaptables a cualquier dispositivo.

---

## 🤝 Contribución

1. Crea una rama para tu característica: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios y haz commit: `git commit -m 'Añade nueva funcionalidad'`
3. Sube tus cambios: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request.

---

Desarrollado con ❤️ por el equipo de **EBV03**.
