'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EditarAtividade() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [atividade, setAtividade] = useState({
    id: '',
    nome: '',
    responsavel: '',
    data: '',
    descricao: '',
    categoria: ''
  });

  const [erro, setErro] = useState('');

  useEffect(() => {
    if (id !== null) {
      const atividades = JSON.parse(localStorage.getItem('atividades') || '[]');
      const atividadeEncontrada = atividades.find((a) => a.id.toString() === id);
      if (atividadeEncontrada) {
        const formattedDate = atividadeEncontrada.data.split('T')[0]; 
        setAtividade({
          ...atividadeEncontrada,
          data: formattedDate
        });
      }
    }
  }, [id]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const hoje = new Date();
    const dataAtividade = new Date(atividade.data);

    hoje.setHours(0, 0, 0, 0); 
    dataAtividade.setHours(0, 0, 0, 0);

    const ontem = new Date();
    ontem.setHours(0, 0, 0, 0); 
    ontem.setDate(hoje.getDate() - 1);

    if (dataAtividade < ontem) {
      setErro('A data da atividade não pode ser no passado.');
      return;
    }

    if (atividade.nome.length < 3) {
      setErro('O nome da atividade deve ter pelo menos 3 caracteres.');
      return;
    }

    setErro(''); // Limpa os erros

    const atividades = JSON.parse(localStorage.getItem('atividades') || '[]');
    const index = atividades.findIndex((a) => a.id.toString() === id);

    if (index !== -1) {
      atividades[index] = { 
        id: parseInt(id),
        nome: atividade.nome, 
        responsavel: atividade.responsavel, 
        data: atividade.data,
        descricao: atividade.descricao, 
        categoria: atividade.categoria 
      };

      localStorage.setItem('atividades', JSON.stringify(atividades));
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">✏️ Editar Atividade</h1>
        <form onSubmit={handleUpdate} className="flex flex-col">
          {/* Exibe a mensagem de erro se houver */}
          {erro && <div className="bg-red-200 text-red-800 p-3 rounded-md mb-4">{erro}</div>}

          <label className="text-gray-700">Nome da Atividade:</label>
          <input 
            type="text" 
            value={atividade.nome} 
            onChange={(e) => setAtividade({...atividade, nome: e.target.value})} 
            required 
            className="border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />

          <label className="text-gray-700">Responsável:</label>
          <input 
            type="text" 
            value={atividade.responsavel} 
            onChange={(e) => setAtividade({...atividade, responsavel: e.target.value})} 
            required 
            className="border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />

          <label className="text-gray-700">Data:</label>
          <input 
            type="date" 
            value={atividade.data} 
            onChange={(e) => setAtividade({...atividade, data: e.target.value})} 
            required 
            className="border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />

          <label className="text-gray-700">Descrição:</label>
          <textarea 
            value={atividade.descricao} 
            onChange={(e) => setAtividade({...atividade, descricao: e.target.value})} 
            required 
            className="border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>

          <label className="text-gray-700">Categoria:</label>
          <select 
            value={atividade.categoria} 
            onChange={(e) => setAtividade({...atividade, categoria: e.target.value})} 
            className="border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Palestra">Palestra</option>
            <option value="Curso">Curso</option>
            <option value="Evento">Evento</option>
            <option value="Seminário">Seminário</option>
            <option value="Workshop">Workshop</option>
          </select>

          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
