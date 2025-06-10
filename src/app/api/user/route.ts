import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/services/connect';
import { z } from 'zod';

const userSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type UserRow = { id: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = userSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.errors }, { status: 400 });
    }
    const { nome, email, senha } = parse.data;
    const connection = await connectToDatabase();
    // Verificar se já existe
    const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]) as unknown as [UserRow[]];
    if (rows.length > 0) {
      await connection.end();
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }
    // Inserir usuário
    await connection.execute('INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha]);
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro ao cadastrar usuário', details: error }, { status: 500 });
  }
} 