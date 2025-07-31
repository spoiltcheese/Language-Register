import React from "react";
import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const Language = (props) => {
  const queryClient = useQueryClient();
  const deleteLanguage = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER + "/languages/" + props.language,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error deleting language");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const doDeleteLanguage = useMutation({
    mutationFn: deleteLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries(["languages"]);
    },
  });

  return (
    <div key={props.index} className="row mb-2">
      <div className="col-md-1">{props.language} </div>
      <button
        className="col-md-1 btn btn-primary"
        onClick={doDeleteLanguage.mutate}
      >
        Delete
      </button>
    </div>
  );
};

export default Language;
