import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import EmojiPicker from 'emoji-picker-react';
import Webcam from 'react-webcam';
import io from 'socket.io-client';

const BACKEND_URL = 'https://projecthub-backend-36s7.onrender.com'; // URL de tu backend en Render
const socket = io(BACKEND_URL);

function App() {
  const [view, setView] = useState('tasks');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  // Más estados para fondos, galería, equipo, etc.

  useEffect(() => {
    // Cargar proyectos del backend
    axios.get(`${BACKEND_URL}/api/projects`, { headers: { Authorization: 'Bearer tu-token' } }) // Agrega auth si es necesario
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));

    // Cargar tareas
    axios.get(`${BACKEND_URL}/api/tasks`)
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));

    // Socket para chats en tiempo real
    socket.on('newMessage', (msg) => {
      // Actualizar chat
      console.log('Nuevo mensaje:', msg);
    });
  }, []);

  // Funciones para crear/editar
  const createProject = (data) => {
    axios.post(`${BACKEND_URL}/api/projects`, data)
      .then(res => setProjects([...projects, res.data]));
  };

  // Similar para tareas, etc.

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar con navegación */}
      <aside style={{ width: '280px', background: '#ffffff', borderRight: '1px solid #e2e8f0', padding: '24px' }}>
        <h2>ProjectHub</h2>
        <ul style={{ listStyle: 'none' }}>
          <li onClick={() => setView('tasks')}>Tareas</li>
          <li onClick={() => setView('calendar')}>Calendario</li>
          <li onClick={() => setView('gallery')}>Galería</li>
          <li onClick={() => setView('funds')}>Fondos</li>
        </ul>
        {/* Lista de proyectos y equipo */}
      </aside>
      {/* Área principal */}
      <main style={{ flexGrow: 1, padding: '32px' }}>
        {view === 'tasks' && (
          <div>
            <h1>Tareas</h1>
            <table>
              <thead><tr><th>Tarea</th><th>Proyecto</th><th>Lugar</th><th>Cuando</th><th>Participantes</th><th>Estado</th></tr></thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.projectId}</td>
                    <td>{task.location}</td>
                    <td>{task.dueDate}</td>
                    <td>{task.participants.join(', ')}</td>
                    <td>{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {view === 'calendar' && (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            initialView="dayGridMonth"
            events={tasks.map(task => ({ title: task.name, date: task.dueDate }))}
          />
        )}
        {/* Otras vistas para galería (con Webcam para cámara), fondos, chat con EmojiPicker y socket */}
      </main>
    </div>
  );
}

export default App;
