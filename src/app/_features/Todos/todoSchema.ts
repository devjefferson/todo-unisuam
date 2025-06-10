import { z } from 'zod';

export const todoSchema = z.object({
  text: z.string().min(1, 'A tarefa não pode ser vazia').max(100, 'Máximo de 100 caracteres'),
});

export type TodoInput = z.infer<typeof todoSchema>; 