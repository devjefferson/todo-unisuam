import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'todos.ccpgoglaezix.us-east-1.rds.amazonaws.com',
  port: 3306,
  user: 'admin',
  password: 'admintodo',
  database: 'todos',
};

export async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Conectado ao MySQL com sucesso!');
    return connection;
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error);
    throw error;
  }
}

