import React, { useRef } from "react";
import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import Language from "./Language";

const DisplayLanguages = () => {
  const queryClient = useQueryClient();
  const languageRef = useRef();

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

  const addLanguages = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/languages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: languageRef.current.value,
        }),
      });

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error("Failed to fetch languages");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const doAddBook = useMutation({
    mutationFn: addLanguages,
    onSuccess: () => {
      queryClient.invalidateQueries(["languages"]);
    },
  });

  {
    languageQuery.isLoading && <p>Loading...</p>;
  }
  {
    languageQuery.isError && <p>{languageQuery.error.message}</p>;
  }

  return (
    <>
      <div className="row">
        <input
          type="text"
          ref={languageRef}
          placeholder="language"
          className="col-md-3"
        />
        <button className="col-md-3 btn btn-primary" onClick={doAddBook.mutate}>
          Add Language
        </button>
      </div>
      Languages
      {languageQuery.isSuccess &&
        languageQuery.data.map((item, index) => {
          return <Language key={index} language={item.language} />;
        })}
    </>
  );
};

export default DisplayLanguages;
