import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/services/connect';
import { todoSchema } from '@/app/_features/Todos/todoSchema';

type TaskDBResult = {
  insertId?: number;
  affectedRows?: number;
};

type TaskFromDB = {
  id: string;
  text: string;
  completed: 0 | 1 | boolean;
  createdAt: string;
  userId: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = todoSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.errors }, { status: 400 });
    }
    const { text, userId } = body;
    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 });
    }
    const connection = await connectToDatabase();
    const [result] = await connection.execute(
      'INSERT INTO todo (text, completed, createdAt, userId) VALUES (?, ?, ?, ?)',
      [text, false, new Date(), userId]
    );
    await connection.end();
    return NextResponse.json({ success: true, id: (result as TaskDBResult).insertId });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Erro ao salvar tarefa', details: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    // Validar id
    if (!body.id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }
    // Validar campos permitidos
    const parse = todoSchema.partial().safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.errors }, { status: 400 });
    }
    const { id, text, completed } = body;
    const connection = await connectToDatabase();
    // Montar query dinâmica
    const updates = [];
    const values = [];
    if (typeof text === 'string') {
      updates.push('text = ?');
      values.push(text);
    }
    if (typeof completed === 'boolean') {
      updates.push('completed = ?');
      values.push(completed);
    }
    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 });
    }
    values.push(id);
    const [result] = await connection.execute(
      `UPDATE todo SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    await connection.end();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro ao atualizar tarefa', details: error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Buscar userId da query ou header
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || req.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 });
    }
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM todo WHERE userId = ? ORDER BY createdAt DESC', [userId]) as unknown as [TaskFromDB[]];
    await connection.end();
    return NextResponse.json({ todos: rows });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro ao buscar tarefas', details: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId') || req.headers.get('user-id');
    if (!id || !userId) {
      return NextResponse.json({ error: 'id e userId são obrigatórios' }, { status: 400 });
    }
    const connection = await connectToDatabase();
    const [result] = await connection.execute('DELETE FROM todo WHERE id = ? AND userId = ?', [id, userId]);
    await connection.end();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro ao deletar tarefa', details: error }, { status: 500 });
  }
} 