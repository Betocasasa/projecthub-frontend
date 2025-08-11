import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EmojiPicker from 'emoji-picker-react';
import Webcam from 'react-webcam';

const BASE_URL = 'https://projecthub-backend-36s7.onrender.com/api';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [funds, setFunds] = useState([]);
  const [teamGallery, setTeamGallery] = useState([]);
  const [privateGallery, setPrivateGallery] = useState([]);
  const [privateEvents, setPrivateEvents] = useState([]);
  const [view, setView] = useState('tasks');
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [isPrivateCalendar, setIsPrivateCalendar] = useState(false);
  const [isPrivateGallery, setIsPrivateGallery] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [currentUser, setCurrentUser] = useState('Ana');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes, teamRes, fundsRes] = await Promise.all([
        axios.get(`${BASE_URL}/projects`),
        axios.get(`${BASE_URL}/tasks`),
        axios.get(`${BASE_URL}/team`),
        axios.get(`${BASE_URL}/funds`)
      ]);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      setTeam(teamRes.data);
      setFunds(fundsRes.data);
      // Asume endpoints para gallery y events; agrega si expandimos
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleCreateProject = async (data) => {
    const res = await axios.post(`${BASE_URL}/projects`, data);
    setProjects([...projects, res.data]);
  };

  const handleUpdateProject = async (id, data) => {
    const res = await axios.put(`${BASE_URL}/projects/${id}`, data);
    setProjects(projects.map(p => p._id === id ? res.data : p));
  };

  const handleCreateTask = async (data) => {
    const res = await axios.post(`${BASE_URL}/tasks`, data);
    setTasks([...tasks, res.data]);
  };

  const handleUpdateTask = async (id, data) => {
    const res = await axios.put(`${BASE_URL}/tasks/${id}`, data);
    setTasks(tasks.map(t => t._id === id ? res.data : t));
  };

  const handleSendChat = async (message) => {
    const res = await axios.post(`${BASE_URL}/tasks/${currentTaskId}/chat`, { user: currentUser, message });
    setChatMessages(res.data);
  };

  const handleUploadFile = async (file, isImage = true) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${BASE_URL}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.url;
  };

  const handleCapturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const file = dataURLtoFile(imageSrc, 'photo.jpg');
    const url = await handleUploadFile(file);
    const task = tasks.find(t => t._id === currentTaskId);
    await handleUpdateTask(currentTaskId, { attachments: [...task.attachments, url] });
  };

  const startVideoRecord = () => {
    setRecording(true);
    const stream = webcamRef.current.stream;
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];
    mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], 'video.webm');
      const url = await handleUploadFile(file, false);
      // Agregar a gallery o attachments
      if (view === 'gallery') {
        const gallery = isPrivateGallery ? privateGallery : teamGallery;
        gallery.push({ url });
        setTeamGallery([...teamGallery]);
        setPrivateGallery([...privateGallery]);
      }
    };
    mediaRecorderRef.current.start();
    setTimeout(() => mediaRecorderRef.current.stop(), 40000);
  };

  const handlePasteClipboard = async () => {
    const text = await navigator.clipboard.readText();
    setNotes(notes + text);
  };

  // Render (usando estilos inline o CSS para v9-like)
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
      <aside style={{ width: '280px', background: '#fff', borderRight: '1px solid #e2e8f0', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '32px', height: '32px', background: '#4f46e5', borderRadius: '0.5rem' }}></div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>ProjectHub</h2>
        </div>
        <h3 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', margin: '24px 0 8px' }}>Vistas</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li onClick={() => setView('tasks')} style={{ cursor: 'pointer', padding: '10px', borderRadius: '0.5rem', background: view === 'tasks' ? '#4f46e5' : 'transparent', color: view === 'tasks' ? 'white' : '#1e293b' }}>Tareas</li>
          <li onClick={() => setView('calendar')} style={{ cursor: 'pointer', padding: '10px', borderRadius: '0.5rem', background: view === 'calendar' ? '#4f46e5' : 'transparent', color: view === 'calendar' ? 'white' : '#1e293b' }}>Calendario</li>
          <li onClick={() => setView('gallery')} style={{ cursor: 'pointer', padding: '10px', borderRadius: '0.5rem', background: view === 'gallery' ? '#4f46e5' : 'transparent', color: view === 'gallery' ? 'white' : '#1e293b' }}>Galería</li>
          <li onClick={() => setView('funds')} style={{ cursor: 'pointer', padding: '10px', borderRadius: '0.5rem', background: view === 'funds' ? '#4f46e5' : 'transparent', color: view === 'funds' ? 'white' : '#1e293b' }}>Fondos</li>
        </ul>
        <h3 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', margin: '24px 0 8px' }}>Proyectos</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {projects.map(p => (
            <li key={p._id} onClick={() => setCurrentProjectId(p._id)} style={{ cursor: 'pointer', padding: '10px', borderRadius: '0.5rem', background: currentProjectId === p._id ? '#4f46e5' : 'transparent', color: currentProjectId === p._id ? 'white' : '#1e293b' }}>{p.name}</li>
          ))}
        </ul>
        <h3 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', margin: '24px 0 8px' }}>Equipo</h3>
        <div>
          {team.map(m => (
            <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundImage: `url(${m.profileImg})`, backgroundSize: 'cover' }}></div>
              <span>{m.name}</span>
            </div>
          ))}
        </div>
      </aside>
      <main style={{ flexGrow: 1, padding: '32px 48px', overflowY: 'auto' }}>
        {view === 'tasks' && (
          <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Tareas</h1>
              <button style={{ padding: '10px 20px', borderRadius: '0.5rem', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer' }} onClick={() => setShowModal(true, setModalType('newTask'))}>+ Nueva Tarea</button>
            </header>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', background: '#f8fafc', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>Tarea</th>
                  <th>Proyecto</th>
                  <th>Lugar</th>
                  <th>Cuando</th>
                  <th>Participantes</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tasks.filter(t => !currentProjectId || t.projectId === currentProjectId).map(t => (
                  <tr key={t._id}>
                    <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 500, cursor: 'pointer' }} onClick={() => setCurrentTaskId(t._id, setShowModal(true, setModalType('taskDetail')))}>{t.name}</td>
                    <td>{projects.find(p => p._id === t.projectId)?.name}</td>
                    <td>{t.location}</td>
                    <td>{new Date(t.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>{t.participants.join(', ')}</td>
                    <td>{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Implementa otros views de manera similar: calendar con FullCalendar, gallery con Webcam, funds */}
        {showModal && modalType === 'taskDetail' && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', width: '800px' }}>
              <h2>{tasks.find(t => t._id === currentTaskId).name}</h2>
              <div>
                <h3>Chat</h3>
                {chatMessages.map((msg, i) => <div key={i}>{msg.user}: {msg.message}</div>)}
                <input type="text" onChange={(e) => {/* handle input */}} />
                <EmojiPicker onEmojiClick={(emoji) => {/* add to input */}} />
                <button onClick={() => handleSendChat(/* message */)}>Enviar</button>
              </div>
              <div>
                <h3>Notas</h3>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                <button onClick={handlePasteClipboard}>Pegar Clipboard</button>
                <button onClick={handleCapturePhoto}>Adjuntar Foto</button>
              </div>
              <Webcam ref={webcamRef} style={{ width: '100%' }} />
              <button onClick={startVideoRecord}>Grabar Video</button>
              <button onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
          </div>
        )}
        {/* Agrega modales para newTask, edit, etc. */}
      </main>
    </div>
  );
};

function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

export default App;
