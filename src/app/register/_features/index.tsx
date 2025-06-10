import Link from 'next/link';
import { useState, ChangeEvent, FormEvent } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface FormData {
  nome: string;
  email: string;
  senha: string;
}

export default function Cadastro() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    senha: '',
  });

  const [mensagem, setMensagem] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { nome, email, senha } = formData;
    if (!nome || !email || !senha) {
      setMensagem('Preencha todos os campos!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
      const result = await response.json();
      if (!response.ok) {
        setMensagem(result.error?.[0]?.message || result.error || 'Erro ao cadastrar usuário');
        setLoading(false);
        return;
      }
      setMensagem('Cadastro realizado com sucesso!');
      setFormData({ nome: '', email: '', senha: '' });
    } catch {
      setMensagem('Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md animate-slide-in"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Cadastro</h2>
        {mensagem && (
          <div className={`mb-4 text-sm text-center ${mensagem.includes('sucesso') ? 'text-green-600' : 'text-red-500'}`}>{mensagem}</div>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Digite seu nome"
            autoFocus
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Digite seu email"
            disabled={loading}
          />
        </div>
        <div className="mb-6 relative">
          <label className="block mb-1 font-medium">Senha</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            placeholder="Digite sua senha"
            disabled={loading}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-8 text-gray-400 hover:text-blue-500"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center disabled:opacity-60"
          disabled={!formData.nome || !formData.email || !formData.senha || loading}
        >
          {loading ? <span className="animate-pulse">Cadastrando...</span> : 'Cadastrar'}
        </button>
        <div className='flex flex-col items-center justify-center mt-4'>
          <p>Já tenho cadastro!</p>
          <Link href="/login" className="text-blue-600 hover:underline">Entrar</Link>
        </div>
      </form>
    </div>
  );
}
