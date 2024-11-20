import React from "react";
import ReactDOM from "react-dom/client";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />

    <ToastContainer
      autoClose={5000}
      position="top-right"
      hideProgressBar={false}
      closeOnClick
      pauseOnHover={false}
      draggable
      theme="light"
      transition={Bounce}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
