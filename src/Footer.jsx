import './css/footer.css'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <a href="/about">Site crée par Kriss CLOTILDE</a>
                    <a href="https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile">linkdin</a>
                </div>
                <p className="footer-copyright">
                    &copy; {new Date().getFullYear()} VotreNomDeSite. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
