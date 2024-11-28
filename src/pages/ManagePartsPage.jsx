import React, { useState, useRef, useCallback } from 'react';
import {
  TextField, Button, Typography, Stack, Dialog,
  DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText
} from '@mui/material';
import axios from 'axios';
import RecordRTC from 'recordrtc';

const ManagePartsPage = () => {
  const [command, setCommand] = useState('');
  const [confirmationList, setConfirmationList] = useState([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [log, setLog] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('lv');
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  const handleLanguageToggle = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'ru' ? 'lv' : 'ru'));
  };

  const handleCommandChange = (e) => {
    setCommand(e.target.value);
  };

  const handleVoiceCommand = useCallback(async () => {
    if (isRecording) {
      // Остановка записи
      if (recorderRef.current) {
        recorderRef.current.stopRecording(async () => {
          const audioBlob = recorderRef.current.getBlob();
          console.log('Запись остановлена, размер блоба:', audioBlob.size);

          recorderRef.current.destroy();
          recorderRef.current = null;
          setIsRecording(false);

          // Остановка потока
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }

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
              console.error('Ожидался массив изменений, получено:', changes);
              setConfirmationList([]);
            }

            setOpenConfirmationDialog(true);
          } catch (error) {
            console.error('Ошибка обработки аудио:', error.message);
            if (error.response) {
              console.error('Статус ответа:', error.response.status);
              console.error('Данные ответа:', error.response.data);
            }
          }
        });
      }
    } else {
      // Начало записи
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error('Ваш браузер не поддерживает доступ к медиаустройствам.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const recorder = new RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/webm',
          recorderType: RecordRTC.MediaStreamRecorder,
        });

        recorder.startRecording();
        recorderRef.current = recorder;
        setIsRecording(true);
      } catch (error) {
        console.error('Ошибка доступа к микрофону:', error);
      }
    }
  }, [isRecording, language]);

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
        console.error('Ожидался массив изменений, получено:', changes);
        setConfirmationList([]);
      }

      setOpenConfirmationDialog(true);
    } catch (error) {
      console.error('Ошибка обработки команды:', error);
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
      console.error('Ошибка применения изменений:', error);
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
          boxShadow: 2,
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
        label={language === 'ru' ? 'Введите команду' : 'Ievadiet komandu'}
        value={command}
        onChange={handleCommandChange}
        fullWidth
        placeholder={
          language === 'ru'
            ? 'Например: Заднее крыло BMW, удалить 3 датчика из Ford'
            : 'Piemēram: Aizmugurējais spārns BMW, izņemt 3 sensorus no Ford'
        }
        sx={{ mb: 3 }}
      />

      <Button
        variant="outlined"
        onClick={handleVoiceCommand}
        sx={{ mb: 1 }}
      >
        {isRecording
          ? language === 'ru'
            ? '🛑 Остановить запись'
            : '🛑 Pārtraukt ierakstu'
          : language === 'ru'
          ? '🎤 Использовать голосовую команду'
          : '🎤 Lietot balss komandu'}
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => processCommand(command)}
      >
        {language === 'ru' ? 'Обработать команду' : 'Apstrādāt komandu'}
      </Button>

      <Button
        variant="outlined"
        onClick={handleLanguageToggle}
        sx={{ mt: 2 }}
      >
        {language === 'ru'
          ? 'Переключить на латышский'
          : 'Pārslēgt uz krievu valodu'}
      </Button>

      <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
        <DialogTitle>{language === 'ru' ? 'Подтвердить изменения' : 'Apstiprināt izmaiņas'}</DialogTitle>
        <DialogContent>
          <Typography>
            {language === 'ru'
              ? 'Вы хотите внести следующие изменения:'
              : 'Vai vēlaties veikt šādas izmaiņas:'}
          </Typography>
          <ul>
            {(confirmationList || []).map((item, index) => (
              <li key={index}>{formatLogEntry(item)}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationDialog(false)} color="secondary">
            {language === 'ru' ? 'Отмена' : 'Atcelt'}
          </Button>
          <Button onClick={confirmChanges} color="primary">
            {language === 'ru' ? 'Да' : 'Jā'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ManagePartsPage;
