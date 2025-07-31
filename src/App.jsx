import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import DisplayLanguages from "./components/DisplayLanguages";
import NavBar from "./components/NavBar";
import DisplayUsers from "./components/DisplayUsers";
import DisplaySingleUser from "./components/DisplaySingleUser";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate replace to="/languages" />} />
        <Route path="/languages" element={<DisplayLanguages />} />
        <Route path="/users" element={<DisplayUsers />} />
        <Route path="/user/:userId" element={<DisplaySingleUser />} />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Suspense>
  );
}

export default App;
