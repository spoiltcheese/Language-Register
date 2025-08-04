import React, { useRef } from "react";
import { useParams } from "react-router";
import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const DisplaySingleUser = (props) => {
  const queryClient = useQueryClient();
  const userLanguageRef = useRef();

  const { userId } = useParams();
  const languageRef = useRef();

  console.log(userId);

  const getLanguages = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/languages");

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error("Failed to fetch languages");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const languageQuery = useQuery({
    queryKey: ["languages"],
    queryFn: getLanguages,
  });

  const getUserName = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error("Failed to fetch user");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getUserLanguages = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER + "/users/languages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        }
      );

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const userNameQuery = useQuery({
    queryKey: ["userName"],
    queryFn: getUserName,
  });

  const query = useQuery({
    queryKey: ["userLanguages"],
    queryFn: getUserLanguages,
  });

  const addUserLanguages = async (language) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER + "/users/languages",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            language: language,
          }),
        }
      );

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const doAddUserLanguage = useMutation({
    mutationFn: (language) => addUserLanguages(language),
    onSuccess: () => {
      queryClient.invalidateQueries(["userLanguages"]);
    },
  });

  const deleteUserLanguage = async (language) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER + "/users/languages",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            language: language,
          }),
        }
      );

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const doDeleteUserLanguage = useMutation({
    mutationFn: (language) => deleteUserLanguage(language),
    onSuccess: () => {
      queryClient.invalidateQueries(["userLanguages"]);
    },
  });

  return (
    <>
      {query.isLoading && <p>Loading...</p>}
      {query.isError && <p>{query.error.message}</p>}
      <DropdownButton
        id="dropdown-basic-button"
        title="Add Language"
        drop="end"
      >
        {languageQuery.isSuccess &&
          languageQuery.data.map((item, index) => {
            return (
              <Dropdown.Item
                key={index}
                href="#"
                onClick={() => doAddUserLanguage.mutate(item.language)}
              >
                {item.language}
              </Dropdown.Item>
            );
          })}
      </DropdownButton>
      <p>Langauges of user {userNameQuery.data && userNameQuery.data.name}</p>
      {query.isSuccess &&
        query.data.map((item, index) => {
          return (
            <div className="row" key={index}>
              <p className="col-md-2">{item}</p>
              <button
                className="col-md-1 btn btn-danger"
                onClick={() => doDeleteUserLanguage.mutate(item)}
              >
                Delete
              </button>
            </div>
          );
        })}
    </>
  );
};

export default DisplaySingleUser;
