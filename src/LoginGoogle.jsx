import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';

const LoginGoogle = () => {
    const handleSuccess = (credentialResponse) => {
        const token = credentialResponse.credential;
        const user = jwtDecode(token);
        console.log('User:', user);
        // Envoyez le token au backend pour validation et connexion
    };

    const handleError = () => {
        console.log("Erreur lors de la connexion avec Google");
    };

    return (
        <GoogleOAuthProvider clientId="1066601295375-5236bq1got1hv55sid8846clcddc7m3f.apps.googleusercontent.com">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin:"20 auto" }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Connectez-vous</h2>
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginGoogle;
