import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ChromeExtension from "./ChromeExtension.tsx";

const RouterPage = () => {
  return (
    <Router>
      <Route path="/"  element={<ChromeExtension />}>
      </Route>
    </Router>
  );
};

export default RouterPage;
