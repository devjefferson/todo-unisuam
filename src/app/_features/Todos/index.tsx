'use client'
import { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { XCircleIcon } from "@heroicons/react/16/solid";

type Task = {
  text: string;
  completed: boolean;
};

export default function Home() { 
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const router = useRouter()
  const token = localStorage.getItem('token')

  useEffect(()=>{
    if(!token){
      router.push('/login')
    }
  
  },[])

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, completed: false }]);
    setInput("");
  };

  const toggleTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-md  relative">
      <button onClick={()=> {
        localStorage.removeItem('token') 
        router.push('/login')
      }} className="absolute top-4 right-4  px-4 py-2 rounded-lg">
       <XCircleIcon className="h-5 w-5  hover:text-red-400 transition duration-500 cursor-pointer" />
      </button>
        <h1 className="text-3xl font-bold text-center mb-6">📝 Lista de Tarefas - Unisuam</h1>
        <div className="flex mb-6">
          <input
            className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-green-500"
            type="text"
            placeholder="Digite uma tarefa..."
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={addTask}
            className="bg-green-500 hover:bg-green-600  px-4 py-2 rounded-r-lg"
          >
            Adicionar
          </button>
        </div>

        <ul className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
          {tasks.length === 0 && (
            <p className=" text-center">Nenhuma tarefa adicionada.</p>
          )}
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`flex items-center justify-between px-4 py-2 rounded-lg bg-white/70 text-gray-800 ${
                task.completed ? "line-through opacity-60" : ""
              }`}
            >
              <span
                className="flex-1 cursor-pointer"
                onClick={() => toggleTask(index)}
              >
                {task.text}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleTask(index)}
                  className="text-green-600 hover:text-green-800"
                  title="Concluir"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => removeTask(index)}
                  className="text-red-500 hover:text-red-700"
                  title="Excluir"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
