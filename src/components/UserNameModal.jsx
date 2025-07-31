import styles from "./Modal.module.css";
import React, { useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import UpdateUserNameOverlay from "./UpdateUserNameOverlay";

const UserNameModal = (props) => {
  UserNameModal.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    setShowModal: PropTypes.func,
    mode: PropTypes.string,
  };

  return (
    <>
      {ReactDOM.createPortal(
        <UpdateUserNameOverlay
          key={props.id}
          id={props.id}
          name={props.name}
          setShowModal={props.setShowModal}
        />,
        document.querySelector("#modal-root")
      )}
      ;
    </>
  );
};

export default UserNameModal;
