'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovaAtividade() {
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Palestra');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hoje = new Date();
    const dataAtividade = new Date(data);

    hoje.setHours(0, 0, 0, 0); 
    dataAtividade.setHours(0, 0, 0, 0); 

 
    const ontem = new Date();
    ontem.setHours(0, 0, 0, 0);
    ontem.setDate(hoje.getDate() - 1);

    if (dataAtividade < ontem) {
      setErro('A data da atividade não pode ser no passado.');
      return;
    }

    if (nome.length < 3) {
      setErro('O nome da atividade deve ter pelo menos 3 caracteres.');
      return;
    }

    setErro('');

    const novaAtividade = { 
      id: Date.now(),
      nome, 
      responsavel, 
      data, 
      descricao, 
      categoria 
    };

    const atividades = JSON.parse(localStorage.getItem('atividades') || '[]');
    atividades.push(novaAtividade);
    localStorage.setItem('atividades', JSON.stringify(atividades));

    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">➕ Cadastrar Nova Atividade</h1>

        {/* Exibe a mensagem de erro se houver */}
        {erro && <div className="bg-red-200 text-red-800 p-3 rounded-md mb-4">{erro}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="text-gray-700">Nome da Atividade:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required 
            className="border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" />

          <label className="text-gray-700">Responsável:</label>
          <input type="text" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} required 
            className="border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" />

          <label className="text-gray-700">Data:</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} required 
            className="border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" />

          <label className="text-gray-700">Descrição:</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required 
            className="border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>

          <label className="text-gray-700">Categoria:</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} 
            className="border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="Palestra">Palestra</option>
            <option value="Curso">Curso</option>
            <option value="Evento">Evento</option>
            <option value="Seminário">Seminário</option>
            <option value="Workshop">Workshop</option>
          </select>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}
