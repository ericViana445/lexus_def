import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index.jsx';
import OpcaoCadastro from './pages/OpcaoCadastro/index_cad.jsx';
import CadastroAluno from './pages/CadastroAluno/index_cad_aluno.jsx';
import CadastroProfessor from './pages/CadastroProfessor/index_cad_prof.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<OpcaoCadastro />} />
        <Route path="/cadastro-aluno" element={<CadastroAluno />} />
        <Route path="/cadastro-professor" element={<CadastroProfessor />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
