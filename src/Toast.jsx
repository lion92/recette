import React, { useEffect, useState } from 'react';
import '../src/css/toast.css'; // Assure-toi de créer un fichier CSS pour le style

const Toast = ({ message, type, duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!visible) return null;

    return (
        <div className={`toast toast-${type}`}>
            {message}
        </div>
    );
};

export default Toast;
