import '../component styles/Footer.css'
import 'bootstrap/dist/css/bootstrap.min.css'


function Footer(){
    return(
        <footer className={'d-flex flex-column text-white'}>
            <a className={'footer-text'} href={''}>contact us</a>
            <a className={'footer-text'} href={''}>about us</a>
        </footer>
    )
}
export default Footer;