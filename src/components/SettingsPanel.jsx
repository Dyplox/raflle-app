import { memo, useState, useEffect, useCallback } from 'react';
import { useRaffle } from '../context/RaffleContext';

const SettingsPanel = memo(({ isOpen, onClose }) => {
    const {
        digitCount, setDigitCount,
        isRaffling, resetRaffle,
        isManualRevealEnabled, setIsManualRevealEnabled,
        countdownDuration, setCountdownDuration,
        isCountdownEnabled, setIsCountdownEnabled,
        clearHistory
    } = useRaffle();

    const [inputValue, setInputValue] = useState(digitCount);
    const [countdownInputValue, setCountdownInputValue] = useState(countdownDuration);

    useEffect(() => {
        setInputValue(digitCount);
    }, [digitCount]);

    useEffect(() => {
        setCountdownInputValue(countdownDuration);
    }, [countdownDuration]);

    const handleChange = useCallback((e) => {
        const value = e.target.value;
        setInputValue(value);

        const val = parseInt(value, 10);
        if (value !== '' && !isNaN(val) && val >= 1 && val <= 5) {
            setDigitCount(val);
            resetRaffle();
        }
    }, [setDigitCount, resetRaffle]);

    const handleCountdownChange = useCallback((e) => {
        const value = e.target.value;
        setCountdownInputValue(value);

        const val = parseInt(value, 10);
        if (value !== '' && !isNaN(val) && val >= 3 && val <= 10) {
            setCountdownDuration(val);
        }
    }, [setCountdownDuration]);

    const handleManualRevealChange = useCallback((e) => {
        setIsManualRevealEnabled(e.target.checked);
    }, [setIsManualRevealEnabled]);

    const handleCountdownEnabledChange = useCallback((e) => {
        setIsCountdownEnabled(e.target.checked);
    }, [setIsCountdownEnabled]);

    const handleClearHistory = useCallback(() => {
        if (window.confirm('¿Estás seguro de que deseas borrar todo el historial?')) {
            clearHistory();
        }
    }, [clearHistory]);

    if (!isOpen) return null;

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="card settings-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="settings-title">Configuración</h2>

                <div className="settings-field">
                    <label className="field-label">
                        Cantidad de Dígitos
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                            type="number"
                            value={inputValue}
                            onChange={handleChange}
                            min="1"
                            max="5"
                            disabled={isRaffling}
                        />
                        <span className="field-hint">
                            (Min 1, Max 5)
                        </span>
                    </div>

                    <div className="settings-field" style={{ marginTop: '2rem' }}>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isCountdownEnabled}
                                onChange={handleCountdownEnabledChange}
                                disabled={isRaffling}
                            />
                            Activar Conteo Regresivo
                        </label>

                        {isCountdownEnabled && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', paddingLeft: '1.5rem' }}>
                                <label className="field-label" style={{ margin: 0, minWidth: 'auto' }}>
                                    Segundos:
                                </label>
                                <input
                                    type="number"
                                    value={countdownInputValue}
                                    onChange={handleCountdownChange}
                                    min="3"
                                    max="10"
                                    disabled={isRaffling}
                                    style={{ width: '70px' }}
                                />
                                <span className="field-hint">
                                    (Min 3, Max 10)
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isManualRevealEnabled}
                                onChange={handleManualRevealChange}
                                disabled={isRaffling}
                            />
                            Revelación por Dígito (Manual)
                        </label>
                    </div>

                    <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                        <button
                            className="btn-secondary"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#f87171',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                marginBottom: '0.75rem'
                            }}
                            onClick={handleClearHistory}
                        >
                            🗑️ Borrar Historial de Sorteos
                        </button>
                        <button
                            className="btn-secondary"
                            style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#fca5a5',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                                if (window.confirm('¿Estás seguro? Esto borrará TODOS los datos guardados y recargará la aplicación.')) {
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    window.location.reload();
                                }
                            }}
                        >
                            🧹 Borrar Cache y Datos
                        </button>
                    </div>
                </div>

                <div className="settings-actions">
                    <button
                        className="btn-primary"
                        style={{ padding: '0.5em 1.5em', fontSize: '1rem' }}
                        onClick={onClose}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
});

SettingsPanel.displayName = 'SettingsPanel';

export default SettingsPanel;
