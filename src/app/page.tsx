'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [atividades, setAtividades] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [atividadesProximas, setAtividadesProximas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const atividadesSalvas = JSON.parse(localStorage.getItem('atividades') || '[]');
    setAtividades(atividadesSalvas);

    const hoje = new Date();
    const umDiaDepois = new Date();
    umDiaDepois.setDate(hoje.getDate() + 1);

    const proximas = atividadesSalvas.filter(atividade => {
      const dataAtividade = new Date(atividade.data);
      return dataAtividade >= hoje && dataAtividade <= umDiaDepois;
    });

    setAtividadesProximas(proximas);
  }, []);

  const excluirAtividade = (id) => {
    const novasAtividades = atividades.filter(atividade => atividade.id !== id);
    setAtividades(novasAtividades);
    localStorage.setItem('atividades', JSON.stringify(novasAtividades));

    const hoje = new Date();
    const umDiaDepois = new Date();
    umDiaDepois.setDate(hoje.getDate() + 1);

    const proximas = novasAtividades.filter(atividade => {
      const dataAtividade = new Date(atividade.data);
      return dataAtividade >= hoje && dataAtividade <= umDiaDepois;
    });

    setAtividadesProximas(proximas);
  };

  const editarAtividade = (id) => {
    router.push(`/editar-atividade?id=${id}`);
  };

  const atividadesOrdenadas = [...atividades].sort((a, b) => {
    return ordemCrescente
      ? new Date(a.data).getTime() - new Date(b.data).getTime()
      : new Date(b.data).getTime() - new Date(a.data).getTime();
  });

  const atividadesFiltradas = atividadesOrdenadas.filter(atividade =>
    (atividade.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    atividade.responsavel.toLowerCase().includes(termoBusca.toLowerCase())) &&
    (categoriaFiltro === 'Todas' || atividade.categoria === categoriaFiltro)
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📌 Lista de Atividades Acadêmicas</h1>

      <button 
        onClick={() => router.push('/nova-atividade')}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
      >
        ➕ Nova Atividade
      </button>

      {atividadesProximas.length > 0 && (
        <div className="bg-yellow-200 text-yellow-800 p-3 rounded-md mb-4 w-full max-w-md">
          <h3 className="font-semibold">🔔 Atividades Próximas!</h3>
          <ul className="list-disc ml-5">
            {atividadesProximas.map((atividade) => (
              <li key={atividade.id}>
                <strong>{atividade.nome}</strong> - {new Date(new Date(atividade.data).setDate(new Date(atividade.data).getDate() + 1)).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      <input 
        type="text" 
        placeholder="🔍 Buscar atividade..." 
        value={termoBusca} 
        onChange={(e) => setTermoBusca(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select 
        value={categoriaFiltro} 
        onChange={(e) => setCategoriaFiltro(e.target.value)} 
        className="mb-4 p-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="Todas">Todas as Categorias</option>
        <option value="Palestra">Palestra</option>
        <option value="Curso">Curso</option>
        <option value="Evento">Evento</option>
        <option value="Seminário">Seminário</option>
        <option value="Workshop">Workshop</option>
      </select>

      <button 
        onClick={() => setOrdemCrescente(!ordemCrescente)}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
      >
        {ordemCrescente ? "⬇️ Ordem Crescente" : "⬆️ Ordem Decrescente"}
      </button>

      {atividadesFiltradas.length === 0 ? (
        <p className="mt-4 text-gray-600">Nenhuma atividade encontrada.</p>
      ) : (
        <ul className="mt-6 w-full max-w-2xl">
          {atividadesFiltradas.map((atividade) => (
            <li key={atividade.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900">{atividade.nome}</h3>
              <p className="text-gray-700"><strong>Responsável:</strong> {atividade.responsavel}</p>
              <p className="text-gray-700"><strong>Data:</strong> {new Date(new Date(atividade.data).setDate(new Date(atividade.data).getDate() + 1)).toLocaleDateString()}</p>
              <p className="text-gray-700"><strong>Categoria:</strong> <span className="text-blue-600">{atividade.categoria}</span></p>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => editarAtividade(atividade.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => excluirAtividade(atividade.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  ❌ Excluir
                </button>
                <button 
                  onClick={() => router.push(`/detalhes?id=${atividade.id}`)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
                >
                  🔍 Ver Detalhes
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}