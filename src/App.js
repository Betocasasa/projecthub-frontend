import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EmojiPicker from 'emoji-picker-react';
import Webcam from 'react-webcam';
import './index.css';

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
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  useEffect() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsRes = await axios.get(`${BASE_URL}/projects`);
      setProjects(projectsRes.data);
      const tasksRes = await axios.get(`${BASE_URL}/tasks`);
      setTasks(tasksRes.data);
      const teamRes = await axios.get(`${BASE_URL}/team`);
      setTeam(teamRes.data);
      const fundsRes = await axios.get(`${BASE_URL}/funds`);
      setFunds(fundsRes.data);
      // Asume gallery y events son locales por simplicidad; agrega APIs si expandimos
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const res = await axios.post(`${BASE_URL}/tasks`, taskData);
      setTasks([...tasks, res.data]);
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const handleUpdateTask = async (id, data) => {
    try {
      const res = await axios.put(`${BASE_URL}/tasks/${id}`, data);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleSendChat = async () => {
    if (chatInput) {
      try {
        const res = await axios.post(`${BASE_URL}/tasks/${currentTaskId}/chat`, { user: currentUser, message: chatInput });
        setChatMessages(res.data);
        setChatInput('');
      } catch (error) {
        console.error('Error sending chat', error);
      }
    }
  };

  const handleEmojiClick = (emoji) => {
    setChatInput(chatInput + emoji.emoji);
    setEmojiPickerOpen(false);
  };

  const handleCapturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const file = dataURLtoFile(imageSrc, 'photo.jpg');
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await axios.post(`${BASE_URL}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        const task = tasks.find(t => t._id === currentTaskId);
        await handleUpdateTask(currentTaskId, { attachments: [...task.attachments, res.data.url] });
      } catch (error) {
        console.error('Error uploading photo', error);
      }
    }
  };

  // Similar para startVideoRecord, handlePasteClipboard, etc.

  return (
    <div className="app">
      {/* Sidebar and Main as in previous */}
      {/* Implement full views and modals */}
    </div>
  );
};

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export default App;
