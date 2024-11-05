import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../src/css/toast.css'; // Assure-toi de créer un fichier CSS pour le style

let toastInstance;

const Toast = ({ message, type, duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        if (message) {
            setVisible(true);
            setToastMessage(message);
            setToastType(type);

            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, type, duration, onClose]);

    // Méthode statique pour afficher le toast
    Toast.show = (msg, toastType = 'success', toastDuration = 3000) => {
        if (toastInstance) {
            toastInstance(msg, toastType, toastDuration);
        }
    };

    if (!visible) return null;

    return (
        <div className={`toast toast-${toastType}`}>
            {toastMessage}
        </div>
    );
};

// Hook pour utiliser Toast.show n'importe où
export const useToast = () => {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        toastInstance = setToast;
    }, []);

    return toast;
};

export default Toast;
