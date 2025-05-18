import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import IndexPage from './pages/index/index.jsx';
import Home from './pages/HomeAll/home.jsx';
import OpcaoCadastro from './pages/OpcaoCadastro/index_cad.jsx';
import CadastroAluno from './pages/CadastroAluno/index_cad_aluno.jsx';
import CadastroProfessor from './pages/CadastroProfessor/index_cad_prof.jsx';
import Chat from './pages/Chat/chat.jsx'; // ✅ import da tela de chat

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />               {/* página inicial */}
        <Route path="/home" element={<Home />} />                {/* após botão logar */}
        <Route path="/cadastro" element={<OpcaoCadastro />} />
        <Route path="/cadastro-aluno" element={<CadastroAluno />} />
        <Route path="/cadastro-professor" element={<CadastroProfessor />} />
        <Route path="/chat" element={<Chat />} />                {/* ✅ nova rota para a tela de chat */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
