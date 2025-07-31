import React, { useState } from "react";
import Modal from "./UserNameModal";
import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const User = (props) => {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const deleteUser = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/users/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: props.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Error deleting language");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const doDeleteUser = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return (
    <>
      {showModal && (
        <Modal
          key={props.id}
          id={props.id}
          name={props.name}
          setShowModal={setShowModal}
          mode="user"
        />
      )}
      <div key={props.index} className="row mb-3">
        <div className="col-md-2">{props.name} </div>
        <button
          className="col-md-1 btn btn-primary"
          onClick={doDeleteUser.mutate}
        >
          Delete
        </button>

        <button
          className="col-md-1 btn btn-warning"
          onClick={() => setShowModal(true)}
        >
          Update
        </button>
      </div>
    </>
  );
};

export default User;
