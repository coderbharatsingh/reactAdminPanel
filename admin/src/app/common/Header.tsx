import * as React from 'react';
import {Navbar} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

const Header: React.FC = () => {
  return (
    <>
        <ToastContainer />

        <Navbar expand="md" id="edulete-navbar">
            <Navbar.Brand className="mx-auto">
                <img src="/images/logo.png" className="logo" />
            </Navbar.Brand>
        </Navbar>
    </>
  );
}

export default Header;
