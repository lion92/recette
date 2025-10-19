import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, LinearProgress } from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateNumber,
  getPasswordStrengthColor,
  getPasswordStrengthLabel
} from '../utils/validation';

/**
 * Composant TextField avec validation en temps réel
 * @param {Object} props - Propriétés du composant
 * @param {string} props.type - Type de validation ('email', 'password', 'required', 'number')
 * @param {string} props.value - Valeur du champ
 * @param {Function} props.onChange - Fonction appelée lors du changement
 * @param {Function} props.onValidation - Fonction appelée avec le résultat de validation
 * @param {Object} props.validationOptions - Options de validation spécifiques
 * @param {boolean} props.showPasswordStrength - Afficher l'indicateur de force du mot de passe
 * @param {boolean} props.validateOnBlur - Valider uniquement au blur (par défaut: false)
 */
function ValidatedTextField({
  type = 'text',
  value = '',
  onChange,
  onValidation,
  validationOptions = {},
  showPasswordStrength = false,
  validateOnBlur = false,
  label,
  ...otherProps
}) {
  const [touched, setTouched] = useState(false);
  const [validation, setValidation] = useState({ isValid: true, error: '', strength: '' });

  // Fonction de validation selon le type
  const performValidation = (val) => {
    let result = { isValid: true, error: '', strength: '' };

    switch (type) {
      case 'email':
        result = validateEmail(val);
        break;
      case 'password':
        result = validatePassword(val, validationOptions);
        break;
      case 'required':
        result = validateRequired(val, label || validationOptions.fieldName);
        break;
      case 'number':
        result = validateNumber(val, { ...validationOptions, fieldName: label });
        break;
      default:
        result = { isValid: true, error: '', strength: '' };
    }

    return result;
  };

  // Validation en temps réel ou au blur
  useEffect(() => {
    if (!validateOnBlur || touched) {
      const result = performValidation(value);
      setValidation(result);

      if (onValidation) {
        onValidation(result);
      }
    }
  }, [value, touched, validateOnBlur]);

  const handleBlur = () => {
    setTouched(true);
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  // Déterminer si on affiche l'erreur
  const showError = touched && !validation.isValid;

  // Icône de validation
  const ValidationIcon = () => {
    if (!touched || value === '') return null;

    if (validation.isValid) {
      return <CheckCircle sx={{ color: 'success.main', ml: 1 }} />;
    }
    return <ErrorIcon sx={{ color: 'error.main', ml: 1 }} />;
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          {...otherProps}
          label={label}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          error={showError}
          helperText={showError ? validation.error : otherProps.helperText}
          fullWidth
          type={type === 'password' ? 'password' : otherProps.type || 'text'}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-error fieldset': {
                borderColor: 'error.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: validation.isValid && touched ? 'success.main' : undefined,
              },
            },
          }}
        />
        <ValidationIcon />
      </Box>

      {/* Indicateur de force du mot de passe */}
      {type === 'password' && showPasswordStrength && value && touched && (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Force du mot de passe
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: getPasswordStrengthColor(validation.strength),
                fontWeight: 600
              }}
            >
              {getPasswordStrengthLabel(validation.strength)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={
              validation.strength === 'weak' ? 33 :
              validation.strength === 'medium' ? 66 :
              validation.strength === 'strong' ? 100 : 0
            }
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getPasswordStrengthColor(validation.strength),
                borderRadius: 3,
              },
            }}
          />
          {validation.strength === 'weak' && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Conseil: Utilisez au moins 8 caractères avec majuscules, chiffres et caractères spéciaux
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default ValidatedTextField;
