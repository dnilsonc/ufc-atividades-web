'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Detalhes() {
  const [atividade, setAtividade] = useState(null);
  const searchParams = useSearchParams();
  const id = parseInt(searchParams.get('id'));

  useEffect(() => {
    if (id) {
      const atividadesSalvas = JSON.parse(localStorage.getItem('atividades') || '[]');
      const atividadeEncontrada = atividadesSalvas.find((atividade) => atividade.id === id);
      if (atividadeEncontrada) {
        setAtividade(atividadeEncontrada);
      } else {
        console.error('Atividade não encontrada');
      }
    }
  }, [id]);

  if (!atividade) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Detalhes da Atividade</h1>
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📌 Detalhes da Atividade</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{atividade.nome}</h2>
        <p className="text-gray-700 mb-4"><strong>Responsável:</strong> {atividade.responsavel}</p>
        <p className="text-gray-700 mb-4"><strong>Data:</strong> {new Date(atividade.data).toLocaleDateString()}</p>
        <p className="text-gray-700 mb-4"><strong>Descrição:</strong> {atividade.descricao}</p>
        <p className="text-gray-700 mb-4"><strong>Categoria:</strong> <span className="text-blue-600">{atividade.categoria}</span></p>
      </div>

      <div className="mt-6">
        <button 
          onClick={() => window.history.back()} 
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}