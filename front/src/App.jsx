import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import IndexPage from './pages/index/index.jsx';
import HomeProfessor from './pages/HomeAll/home.jsx';
import OpcaoCadastro from './pages/OpcaoCadastro/index_cad.jsx';
import CadastroAluno from './pages/CadastroAluno/index_cad_aluno.jsx';
import CadastroProfessor from './pages/CadastroProfessor/index_cad_prof.jsx';
import Chat from './pages/Chat/chat.jsx';
import Login from './pages/Login/login.jsx';
import Tema from './pages/Tema/tema.jsx'
import HomeAluno from './pages/HomeAluno/homeAluno.jsx';
import Podcast from "./pages/Podcast/podcast.jsx";
import Ler from './pages/Ler/ler.jsx'

const App = () => {
  console.log("✅ App carregado");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/home" element={<HomeProfessor />} />
        <Route path="/cadastro" element={<OpcaoCadastro />} />
        <Route path="/cadastro-aluno" element={<CadastroAluno />} />
        <Route path="/cadastro-professor" element={<CadastroProfessor />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tema" element={<Tema />} />
        <Route path="/homeAluno" element={<HomeAluno />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/lermais" element={<Ler />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
