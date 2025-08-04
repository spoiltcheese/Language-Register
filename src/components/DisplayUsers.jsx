import React, { useState, useRef, useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import User from "./User";

const DisplayUsers = () => {
  const queryClient = useQueryClient();
  const userRef = useRef();
  const [errMsg, setErrMsg] = useState(true);

  const getUsers = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/users");

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const addUsers = async () => {
    if (userRef.current.value === "") {
      setErrMsg(true);
      return;
    } else {
      setErrMsg(false);
    }
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userRef.current.value,
        }),
      });

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const doAddUser = useMutation({
    mutationFn: addUsers,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      if (userRef.current) userRef.current.value = "";
    },
  });

  {
    userQuery.isLoading && <p>Loading...</p>;
  }
  {
    userQuery.isError && <p>{userQuery.error.message}</p>;
  }

  useEffect(() => {
    if (doAddUser.isSuccess) {
      setErrMsg(true);
    }
  }, [doAddUser.isSuccess, doAddUser.isError]);

  const handleInputChange = (e) => {
    setErrMsg(e.target.value.trim() === "");
  };

  return (
    <>
      <div className="row">
        <input
          type="text"
          ref={userRef}
          placeholder="add user"
          className="col-md-3"
          onChange={handleInputChange}
        />
        <button
          className="col-md-3 btn btn-primary"
          onClick={doAddUser.mutate}
          disabled={errMsg}
        >
          Add User
        </button>
        {errMsg && <span>User name cannot be blank</span>}
      </div>
      Users
      {userQuery.isSuccess &&
        userQuery.data.map((item, index) => {
          return <User key={index} id={item.id} name={item.name} />;
        })}
    </>
  );
};

export default DisplayUsers;
