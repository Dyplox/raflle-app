import { useState } from 'react';
import SettingsPanel from './SettingsPanel';

const Layout = ({ children }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="app-container">
            <header className="header-container">
                <div className="logo-container">
                    <div className="logo-icon" />
                    <h1 className="logo-text">
                        Gran <span className="logo-accent">Rifa</span>
                    </h1>
                </div>

                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="btn-settings"
                    aria-label="Abrir configuración"
                >
                    ⚙️ Configurar
                </button>
            </header>

            <main>
                {children}
            </main>

            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
};

export default Layout;
