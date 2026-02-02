import React, { memo } from 'react';
import { useRaffle } from '../context/RaffleContext';

const RaffleHistory = () => {
    const { history } = useRaffle();

    return (
        <aside className="history-sidebar">
            <h3 className="history-title">
                📋 Historial
            </h3>

            <div className="history-list">
                {history && history.length > 0 ? (
                    history.map((record, index) => (
                        <div
                            key={record.id}
                            className={`history-item ${index === 0 ? 'latest' : ''}`}
                        >
                            <span className="history-number">
                                {record.number}
                            </span>
                            <span className="history-time">
                                {record.timestamp}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="history-empty">
                        Aún no hay resultados
                    </div>
                )}
            </div>
        </aside>
    );
};

export default memo(RaffleHistory);
