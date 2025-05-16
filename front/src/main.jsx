import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index.jsx';
import OpcaoCadastro from './pages/OpcaoCadastro/index_cad.jsx';
import CadastroAluno from './pages/CadastroAluno/index_cad_aluno.jsx';
import CadastroProfessor from "./pages/CadastroProfessor/index_cad_prof.jsx";
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Elemento com id 'root' não encontrado no HTML.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<OpcaoCadastro />} />
        <Route path="/cadastro-aluno" element={<CadastroAluno />} />
        <Route path="/cadastro-professor" element={<CadastroProfessor />} /> {/* <- Nova rota */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);