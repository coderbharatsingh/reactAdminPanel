import * as React from 'react';
import { faBell, faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Card, Nav, Navbar } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { CardCss, NavbarCss, NavRightCss } from './Css';
import { faPlusSquare, faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { Variables } from '../Variables';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <>
        <ToastContainer />

      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/" className="nav-link">Home</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Header;
