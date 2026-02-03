import { memo, useCallback, useState } from 'react';
import { useRaffle } from '../context/RaffleContext';

const HistoryItem = memo(({ record, index, onUpdateName }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(record.winnerName || '');

    const handleSave = () => {
        onUpdateName(record.id, name);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setName(record.winnerName || '');
            setIsEditing(false);
        }
    };

    return (
        <div className={`history-item ${index === 0 ? 'latest' : ''}`}>
            <div className="history-main">
                <span className="history-number">
                    {record.number}
                </span>
                <span className="history-time">
                    {record.timestamp}
                </span>
            </div>
            <div className="history-winner-name">
                {isEditing ? (
                    <input
                        type="text"
                        className="winner-name-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        placeholder="Nombre del ganador"
                        autoFocus
                    />
                ) : (
                    <span
                        className="winner-name-display"
                        onClick={() => setIsEditing(true)}
                        title="Clic para editar"
                    >
                        {record.winnerName || '+ Agregar nombre'}
                    </span>
                )}
            </div>
        </div>
    );
});

HistoryItem.displayName = 'HistoryItem';

const RaffleHistory = memo(() => {
    const { history, updateWinnerName } = useRaffle();

    const handleUpdateName = useCallback((id, name) => {
        updateWinnerName(id, name);
    }, [updateWinnerName]);

    return (
        <aside className="history-sidebar">
            <h3 className="history-title">
                📋 Historial
            </h3>

            <div className="history-list">
                {history && history.length > 0 ? (
                    history.map((record, index) => (
                        <HistoryItem
                            key={record.id}
                            record={record}
                            index={index}
                            onUpdateName={handleUpdateName}
                        />
                    ))
                ) : (
                    <div className="history-empty">
                        Aún no hay resultados
                    </div>
                )}
            </div>
        </aside>
    );
});

RaffleHistory.displayName = 'RaffleHistory';

export default RaffleHistory;
