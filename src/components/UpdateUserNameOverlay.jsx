import React, { useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styles from "./Modal.module.css";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const UpdateUserNameOverlay = (props) => {
  const nameRef = useRef();

  const queryClient = useQueryClient();

  UpdateUserNameOverlay.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
  };

  const updateUser = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: props.id,
          name: nameRef.current.value,
        }),
      });

      if (!res.ok) {
        throw new Error("Error updating user");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const { mutate } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      props.setShowModal(false);
    },
  });

  return (
    <div className={styles.modal}>
      <h1>Update User {props.id}</h1>
      <div className="row">
        <input
          type="text"
          ref={nameRef}
          placeholder="name"
          className="col-md-4"
          defaultValue={props.name}
        />
      </div>
      <div className="row">
        <div className="col-md-3"></div>
        <button onClick={mutate} className="col-md-3">
          Update User Name
        </button>
        <button onClick={() => props.setShowModal(false)} className="col-md-3">
          Close window
        </button>
      </div>
    </div>
  );
};

export default UpdateUserNameOverlay;
