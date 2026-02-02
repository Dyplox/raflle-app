import { useRaffle } from '../context/RaffleContext';
import { useState, useEffect } from 'react';

const SettingsPanel = ({ isOpen, onClose }) => {
    const {
        digitCount, setDigitCount,
        isRaffling, resetRaffle,
        isManualRevealEnabled, setIsManualRevealEnabled
    } = useRaffle();

    const [inputValue, setInputValue] = useState(digitCount);

    useEffect(() => {
        setInputValue(digitCount);
    }, [digitCount]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        const val = parseInt(value);
        if (value !== '' && !isNaN(val) && val >= 1 && val <= 5) {
            setDigitCount(val);
            resetRaffle();
        }
    };

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

                    <div style={{ marginTop: '2rem' }}>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isManualRevealEnabled}
                                onChange={(e) => setIsManualRevealEnabled(e.target.checked)}
                                disabled={isRaffling}
                            />
                            Revelación por Dígito (Manual)
                        </label>
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
};

export default SettingsPanel;
