import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/services/connect';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type UserLoginRow = { id: string; nome: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = loginSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.errors }, { status: 400 });
    }
    const { email, senha } = parse.data;
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT id, nome FROM users WHERE email = ? AND senha = ?', [email, senha]) as unknown as [UserLoginRow[]];
    await connection.end();
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Email ou senha inválidos' }, { status: 401 });
    }
    // Retornar id e nome do usuário
    const user = rows[0];
    return NextResponse.json({ success: true, user: { id: user.id, nome: user.nome, email } });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro ao fazer login', details: error }, { status: 500 });
  }
} 