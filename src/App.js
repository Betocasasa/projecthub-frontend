import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import EmojiPicker from 'emoji-picker-react';
import Webcam from 'react-webcam';
import io from 'socket.io-client';
import './styles.css'; // Importa los estilos para que se apliquen

const BACKEND_URL = 'https://projecthub-backend-36s7.onrender.com'; // URL de tu backend
const socket = io(BACKEND_URL);

function App() {
  const [view, setView] = useState('tasks');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Cargar proyectos del backend
    axios.get(`${BACKEND_URL}/api/projects`)
      .then(res => setProjects(res.data))
      .catch(err => console.error('Error cargando proyectos:', err));

    // Cargar tareas del backend
    axios.get(`${BACKEND_URL}/api/tasks`)
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error cargando tareas:', err));

    // Socket para chats (actualiza en tiempo real)
    socket.on('newMessage', (msg) => {
      console.log('Nuevo mensaje en chat:', msg);
      // Aquí puedes actualizar el chat si tienes un estado para él
    });
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar con navegación */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo"></div>
          <h2>ProjectHub</h2>
        </div>
        <h3>Vistas</h3>
        <ul className="nav-list">
          <li className={view === 'tasks' ? 'active' : ''} onClick={() => setView('tasks')}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            Tareas
          </li>
          <li className={view === 'calendar' ? 'active' : ''} onClick={() => setView('calendar')}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Calendario
          </li>
          <li className={view === 'gallery' ? 'active' : ''} onClick={() => setView('gallery')}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Galería
          </li>
          <li className={view === 'funds' ? 'active' : ''} onClick={() => setView('funds')}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Fondos
          </li>
        </ul>
        {/* Lista de proyectos y equipo - agrega cuando tengas datos */}
      </aside>
      {/* Área principal */}
      <main className="main-content">
        <div className={`content-view ${view === 'tasks' ? 'active' : ''}`}>
          <header><h1>Tareas</h1><button className="btn btn-primary">+ Nueva Tarea</button></header>
          <table className="task-table">
            <thead><tr><th>Tarea</th><th>Proyecto</th><th>Lugar</th><th>Cuando</th><th>Participantes</th><th>Estado</th></tr></thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="task-name-cell">{task.name}</td>
                  <td>{task.projectId}</td>
                  <td>{task.location}</td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>{task.participants.join(', ')}</td>
                  <td><select className="status-select"><option>{task.status}</option></select></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`content-view ${view === 'calendar' ? 'active' : ''}`}>
          <header><h1>Calendario</h1></header>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            initialView="dayGridMonth"
            events={tasks.map(task => ({ title: task.name, date: task.dueDate }))}
          />
        </div>
        {/* Otras vistas */}
      </main>
    </div>
  );
}

export default App;
