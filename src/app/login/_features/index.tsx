import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  email: string;
  senha: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    senha: '',
  });

  const router = useRouter();

  const [mensagem, setMensagem] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const {  email, senha } = formData;

    if ( !email || !senha) {
      setMensagem('Preencha todos os campos!');
      return;
    }

    console.log('Dados enviados:', formData);
    setMensagem('Login realizado com sucesso!');

    localStorage.setItem('token', '1234567890');
    setTimeout(()=>{
      router.push('/');
    }, 1000)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Entrar</h2>

        {mensagem && (
          <div className="mb-4 text-sm text-center text-red-500">{mensagem}</div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Senha</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Entrar
        </button>
        <div className='flex flex-col items-center justify-center mt-4'>
          <p>Ainda não tem cadastro?</p>
        <Link href="/register">
          Cadastrar-se
        </Link>
        </div>
      </form>
    </div>
  );
}
