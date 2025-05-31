// src/components/PublicarButton.jsx
import { useRef } from 'react';

function PublicarButton({ emailAluno, codigoSala, tipo, titulo, conteudo, imagem = null, onSuccess, onError }) {
  const formRef = useRef(new FormData());

  const handleClick = async () => {
    const formData = new FormData();
    formData.append("email_aluno", emailAluno);
    formData.append("codigo_sala", codigoSala);
    formData.append("tipo", tipo);
    formData.append("titulo", titulo);
    formData.append("conteudo", conteudo);
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      const response = await fetch("http://localhost:8000/publicar", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Publicação enviada com sucesso:", data);
        onSuccess?.(data);
      } else {
        console.error("Erro ao publicar:", data.detail);
        onError?.(data.detail);
      }
    } catch (err) {
      console.error("Erro ao publicar:", err);
      onError?.(err);
    }
  };

  return (
    <button onClick={handleClick}>
      Publicar
    </button>
  );
}

export default PublicarButton;
