import React, {useEffect} from 'react';
import useApiStore from './useApiStore'; // Importer le store Zustand

const UserCalendar = () => {
    const {
        calendarEvents, // Événements du calendrier depuis le store
        fetchCalendarEvents, // Fonction pour charger les événements
        deleteCalendarEvent, // Fonction pour supprimer un événement
        loading,
        error,
    } = useApiStore(); // Récupérer les états et méthodes du store

    useEffect(() => {
        fetchCalendarEvents(); // Charger les événements au montage
    }, [fetchCalendarEvents]);

    if (loading) {
        return <p>Chargement...</p>;
    }

    return (
        <div style={{padding: '20px'}}>
            <h2>Mon Calendrier</h2>
            {error && (
                <p
                    style={{
                        color: 'red',
                        marginBottom: '15px',
                    }}
                >
                    {error}
                </p>
            )}
            {calendarEvents.length > 0 ? (
                <ul style={{listStyleType: 'none', padding: 0}}>
                    {calendarEvents.map((event) => (
                        <li
                            key={event.id}
                            style={{
                                marginBottom: '10px',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <strong>{event.recipe.title}</strong> -{' '}
                                {new Date(event.date).toLocaleDateString()}
                                <p>{event.recipe.description}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteCalendarEvent(event.id)
                                }} // Appeler la méthode du store
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#FF6B6B',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune recette n'est programmée dans votre calendrier.</p>
            )}
        </div>
    );
};

export default UserCalendar;
