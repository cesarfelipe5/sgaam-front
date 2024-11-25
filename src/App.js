import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css"; // Importar o CSS global
import AulasExperimentais from "./pages/AulasExperimentais";
import FormaPagamento from "./pages/FormaPagamento";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import Mensalidades from "./pages/Mensalidades";
import Modalidades from "./pages/Modalidades";
import Pagamentos from "./pages/Pagamentos";
import Planos from "./pages/Planos";
import Relatorios from "./pages/Relatorios";
import UsersPermissoes from "./pages/UsersPermissoes";

function App() {
  const token = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="*" element={<Login />} />
        {token ? (
          <>
            <Route path="/main" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/aulasexperimentais"
              element={<AulasExperimentais />}
            />
            <Route path="/mensalidades" element={<Mensalidades />} />
            <Route path="/modalidades" element={<Modalidades />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
            <Route path="/planos" element={<Planos />} />
            <Route path="/formaPagamento" element={<FormaPagamento />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/userpermissoes" element={<UsersPermissoes />} />
          </>
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
