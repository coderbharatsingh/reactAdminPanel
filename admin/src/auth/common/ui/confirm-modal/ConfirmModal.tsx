import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface BodyParams {
  show: boolean;
  hideModel: () => void;
  successHandler: () => void;
}

const ConfirmModal: React.FC<BodyParams> = ({ show, hideModel, successHandler }) => {
  const handleClose = () => {
    hideModel();
  }

  const handleSuccess = () => {
    hideModel();
    successHandler();
  }

  return (
    <>
      <Modal show={show} className="form-modal" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>

        <Modal.Body>Are you want to sure for this action?</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
              Close
          </Button>
          <Button variant="primary" onClick={handleSuccess}>
              Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmModal;
