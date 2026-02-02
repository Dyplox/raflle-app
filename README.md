# Gran Rifa App 🏆

Esta es una aplicación web moderna para realizar sorteos y rifas digitales de manera emocionante y visual. Construida con React y Vite, diseñada para eventos en vivo con animaciones de celebración de colores doradas para emocionar al ganador.

## Características

-   **Sorteo Dinámico**: Animación de "barajado" de números para generar tensión.
-   **Modos de Revelación**:
    -   *Tradicional*: Revela el ganador completo automáticamente.
    -   *Paso a Paso*: Revela dígito por dígito para mayor suspense (configurable).
-   **Celebración "Super"**:
    -   Confeti dorado desde cañones laterales.
    -   Globos flotantes con física realista.
    -   Fuegos artificiales circulares.
-   **Historial**: Sidebar lateral con el registro de los últimos ganadores.
-   **Diseño Responsivo**: Adaptable a pantallas grandes (proyectores) y dispositivos móviles.
-   **Configurable**: Ajuste de cantidad de dígitos (1-5) y modalidad.

## Tecnologías

-   **React 19**: Lógica de componentes y estado.
-   **Vite**: Entorno de desarrollo ultrarrápido.
-   **PNPM**: Gestión eficiente de dependencias.
-   **Canvas Confetti**: Efectos de partículas de alto rendimiento.

## Instalación y Uso

1.  **Clonar el repositorio**:
    ```bash
    git clone <https://github.com/Dyplox/raflle-app.git>
    cd raffle-app
    ```

2.  **Instalar dependencias**:
    Asegúrate de tener `pnpm` instalado.
    ```bash
    pnpm install
    ```

3.  **Correr en desarrollo**:
    ```bash
    pnpm dev
    ```

4.  **Construir para producción**:
    ```bash
    pnpm build
    ```

## Estructura del Proyecto

-   `src/components`: Componentes UI (RaffleDisplay, RaffleHistory, Layout).
-   `src/context`: Lógica de estado global (RaffleContext).
-   `src/App.jsx`: Componente principal y lógica de celebración.
-   `src/index.css`: Estilos globales y variables de diseño.

## Licencia

MIT
