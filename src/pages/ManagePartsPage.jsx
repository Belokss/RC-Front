// ManagePartsPage.js

import React, { useState, useRef } from 'react';
import {
  TextField, Button, Typography, Stack, Dialog,
  DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText
} from '@mui/material';
import axios from 'axios';

const ManagePartsPage = () => {
  const [command, setCommand] = useState('');
  const [confirmationList, setConfirmationList] = useState([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [log, setLog] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('lv'); // Установлено на латышский по умолчанию
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const handleLanguageToggle = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'ru' ? 'lv' : 'ru'));
  };

  const handleCommandChange = (e) => {
    setCommand(e.target.value);
  };

  const handleVoiceCommand = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        let mimeType = '';
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        } else {
          console.error('No available audio recording formats');
          return;
        }

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('language', language);

          try {
            const response = await axios.post('/api/voice-command', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
            });

            const { changes } = response.data;

            if (Array.isArray(changes)) {
              setConfirmationList(changes);
            } else {
              console.error("Expected changes array, received:", changes);
              setConfirmationList([]);
            }

            setOpenConfirmationDialog(true);
          } catch (error) {
            console.error("Error processing audio:", error);
          }

          streamRef.current.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  const formatLogEntry = (item) => {
    const action = item.action === 'add' ? 'Pievienots' : 'Izņemts';
    const qty = item.quantity || '1';
    return `${item.manufacturer} ${item.model} ${item.part} ${qty}gab. - ${action}`;
  };

  const processCommand = async (cmd) => {
    try {
      const response = await axios.post('/api/process-command', { command: cmd, language });
      const { changes } = response.data;

      if (Array.isArray(changes)) {
        setConfirmationList(changes);
      } else {
        console.error("Expected changes array, received:", changes);
        setConfirmationList([]);
      }

      setOpenConfirmationDialog(true);
    } catch (error) {
      console.error("Error processing command:", error);
    }
  };

  const confirmChanges = async () => {
    try {
      await axios.post('/api/execute-changes', { changes: confirmationList });

      const newEntries = confirmationList.map((item) => {
        const timestamp = new Date().toLocaleString();
        const formattedEntry = formatLogEntry(item);
        return `${timestamp} - ${formattedEntry}`;
      });
      setLog((prevLog) => [...newEntries, ...prevLog]);

      setOpenConfirmationDialog(false);
      setCommand('');
      setConfirmationList([]);
    } catch (error) {
      console.error("Error executing changes:", error);
    }
  };

  return (
    <Stack spacing={3} sx={{ p: 2, height: '85vh' }}>
      <Typography variant="h4">Rezerves daļu pārvaldība</Typography>

      <Stack
        sx={{
          height: '60vh',
          overflowY: 'auto',
          bgcolor: 'grey.100',
          p: 3,
          borderRadius: 2,
          width: '100%',
          boxShadow: 2
        }}
      >
        <Typography variant="h6">Izmaiņu žurnāls</Typography>
        <List>
          {log.map((entry, index) => (
            <ListItem key={index}>
              <ListItemText primary={entry} />
            </ListItem>
          ))}
        </List>
      </Stack>

      <TextField
        label={language === 'ru' ? "Введите команду" : "Ievadiet komandu"}
        value={command}
        onChange={handleCommandChange}
        fullWidth
        placeholder={
          language === 'ru'
            ? "Например: Заднее крыло BMW, удалить 3 датчика из Ford"
            : "Piemēram: Aizmugurējais spārns BMW, izņemt 3 sensorus no Ford"
        }
        sx={{ mb: 3 }}
      />

      <Button
        variant="outlined"
        onClick={handleVoiceCommand}
        sx={{ mb: 1 }}
      >
        {isRecording 
          ? (language === 'ru' ? "🛑 Остановить запись" : "🛑 Pārtraukt ierakstu") 
          : (language === 'ru' ? "🎤 Использовать голосовую команду" : "🎤 Lietot balss komandu")}
      </Button>

      <Button variant="contained" color="primary" onClick={() => processCommand(command)}>
        {language === 'ru' ? "Обработать команду" : "Apstrādāt komandu"}
      </Button>

      {/* Переносим кнопку переключения языка сюда */}
      <Button variant="outlined" onClick={handleLanguageToggle} sx={{ mt: 2 }}>
        {language === 'ru' ? 'Переключить на латышский' : 'Pārslēgt uz krievu valodu'}
      </Button>

      <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
        <DialogTitle>{language === 'ru' ? "Подтвердить изменения" : "Apstiprināt izmaiņas"}</DialogTitle>
        <DialogContent>
          <Typography>
            {language === 'ru' ? "Вы хотите внести следующие изменения:" : "Vai vēlaties veikt šādas izmaiņas:"}
          </Typography>
          <ul>
            {(confirmationList || []).map((item, index) => (
              <li key={index}>{formatLogEntry(item)}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationDialog(false)} color="secondary">
            {language === 'ru' ? "Отмена" : "Atcelt"}
          </Button>
          <Button onClick={confirmChanges} color="primary">
            {language === 'ru' ? "Да" : "Jā"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ManagePartsPage;
