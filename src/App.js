import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EmojiPicker from 'emoji-picker-react';
import Webcam from 'react-webcam';

const BASE_URL = 'https://projecthub-backend-36s7.onrender.com/api'; // Tu URL de Render

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
  const [showModal, setShowModal] = useState(null);
  const [modalType, setModalType] = useState('');
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [currentUser, setCurrentUser] = useState('Ana');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
    // Similar para galleries y events si agregamos endpoints
  };

  // Funciones para tareas, proyectos, etc., usando axios.post/put

  // Render de componentes (sidebar, views, modals) con JSX basado en v9

  return <div> {/* Interfaz completa aquí */ }</div>;
};

export default App;
