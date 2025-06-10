'use client'
import { useState, useEffect } from "react";
import { 
  CheckCircleIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { XCircleIcon, CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/16/solid";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema, TodoInput } from './todoSchema';

type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

type FilterType = 'all' | 'pending' | 'completed';

type TaskFromDB = {
  id: string;
  text: string;
  completed: 0 | 1 | boolean;
  createdAt: string;
  userId: string;
};

export default function Home() { 
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [loadingTodos, setLoadingTodos] = useState(true);
  const router = useRouter()
   

  useEffect(()=>{
    const userId = localStorage.getItem('userId')
    if(!userId){
      router.push('/login')
    }
  },[router])

  // Persistir tarefas no localStorage

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // React Hook Form
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<TodoInput>({
    resolver: zodResolver(todoSchema),
    mode: 'onChange',
  });
  const textValue = watch('text') || '';

  const addTask = async (data: TodoInput) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.text.trim(), userId })
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.error?.[0]?.message || 'Erro ao salvar tarefa no banco de dados');
        return;
      }
      const newTask: Task = {
        id: result.id?.toString() || Date.now().toString(),
        text: data.text.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTasks([newTask, ...tasks]);
      reset();
    } catch {
      alert('Erro ao salvar tarefa no banco de dados');
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const response = await fetch('/api/todo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !task.completed })
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.error?.[0]?.message || 'Erro ao atualizar tarefa no banco de dados');
        return;
      }
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch {
      alert('Erro ao atualizar tarefa no banco de dados');
    }
  };

  const removeTask = async (id: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const response = await fetch(`/api/todo?id=${id}&userId=${userId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.error?.[0]?.message || result.error || 'Erro ao deletar tarefa');
        return;
      }
      setTasks(tasks.filter(task => task.id !== id));
      setShowDeleteConfirm(null);
    } catch {
      alert('Erro ao deletar tarefa');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  };

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Ctrl/Cmd + / para focar na busca
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        searchInput?.focus();
      }
      
      // Ctrl/Cmd + N para focar no input de nova tarefa
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const taskInput = document.getElementById('task-input');
        taskInput?.focus();
      }
      
      // Escape para limpar busca
      if (e.key === 'Escape' && searchTerm) {
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm]);

  useEffect(() => {
    const fetchTodos = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) { setLoadingTodos(false); return; }
      try {
        const response = await fetch(`/api/todo?userId=${userId}`);
        const result = await response.json();
        if (response.ok && Array.isArray(result.todos)) {
          setTasks(result.todos.map((t: TaskFromDB) => ({
            ...t,
            completed: t.completed === true || t.completed === 1,
            createdAt: new Date(t.createdAt)
          })));
        }
      } catch {
        // erro silencioso
      } finally {
        setLoadingTodos(false);
      }
    };
    fetchTodos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📝</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lista de Tarefas</h1>
                <p className="text-sm text-gray-600">UNISUAM - Organize suas atividades</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="hidden sm:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-xs text-gray-600">Concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                <div className="text-xs text-gray-600">Pendentes</div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
              aria-label="Sair do sistema"
            >
              <XCircleIcon className="h-6 w-6 text-red-500 hover:text-red-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Add Task Section */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                id="task-input"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white/80"
                type="text"
                placeholder="O que você precisa fazer hoje?"
                maxLength={100}
                aria-label="Nova tarefa"
                {...register('text')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit(addTask)();
                }}
              />
              <div className="mt-2 text-right text-xs text-gray-500">
                {textValue.length}/100 caracteres
              </div>
              {errors.text && (
                <div className="text-xs text-red-500 mt-1">{errors.text.message}</div>
              )}
            </div>
            <button
              type="button"
              onClick={handleSubmit(addTask)}
              disabled={!!errors.text}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
              aria-label="Adicionar nova tarefa"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="search-input"
                type="text"
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80"
                aria-label="Buscar tarefas"
              />
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              {(['all', 'pending', 'completed'] as FilterType[]).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === filterType
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white/50 text-gray-700 hover:bg-white/80'
                  }`}
                  aria-label={`Filtrar por tarefas ${filterType === 'all' ? 'todas' : filterType === 'pending' ? 'pendentes' : 'concluídas'}`}
                >
                  {filterType === 'all' ? 'Todas' : filterType === 'pending' ? 'Pendentes' : 'Concluídas'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6">
          {loadingTodos ? (
            <div className="flex flex-col items-center justify-center py-12 animate-pulse">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="text-blue-600 font-medium">Carregando tarefas...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhuma tarefa encontrada' : tasks.length === 0 ? 'Nenhuma tarefa ainda' : 'Nenhuma tarefa neste filtro'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Tente buscar por outros termos' : tasks.length === 0 ? 'Comece adicionando sua primeira tarefa!' : 'Tente outro filtro'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    task.completed
                      ? 'bg-green-50/50 border-green-200 opacity-75'
                      : 'bg-white/80 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                      aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
                    >
                      {task.completed && <CheckCircleSolid className="h-4 w-4" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-sm font-medium transition-all duration-200 ${
                          task.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-900'
                        }`}
                      >
                        {task.text}
                      </span>
                      <span className="text-xs text-gray-500">
                        {task.createdAt.toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {showDeleteConfirm === task.id ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">Confirmar?</span>
                        <button
                          onClick={() => removeTask(task.id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                          aria-label="Confirmar exclusão"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="p-1 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                          aria-label="Cancelar exclusão"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(task.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        aria-label="Excluir tarefa"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Stats */}
        <div className="sm:hidden mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 text-center border border-white/50">
            <div className="text-xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 text-center border border-white/50">
            <div className="text-xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-600">Concluídas</div>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 text-center border border-white/50">
            <div className="text-xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pendentes</div>
          </div>
        </div>
      </main>
    </div>
  );
}
