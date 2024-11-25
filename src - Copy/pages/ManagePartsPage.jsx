// ManagePartsPage.js

import React, { useState, useRef } from 'react';
import {
  TextField, Button, Typography, Stack, Dialog,
  DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import axios from 'axios';

const ManagePartsPage = () => {
  const [command, setCommand] = useState('');
  const [confirmationList, setConfirmationList] = useState([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [log, setLog] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('lv'); // 'lv' - латышский, 'ru' - русский
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const handleCommandChange = (e) => {
    setCommand(e.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
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
          console.error('Nav pieejami audio ieraksta formāti');
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

          try {
            const response = await axios.post('/api/voice-command', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
              params: { language },
            });

            const { changes } = response.data;

            if (Array.isArray(changes)) {
              setConfirmationList(changes);
            } else {
              console.error("Gaidīju izmaiņu masīvu, saņēmu:", changes);
              setConfirmationList([]);
            }

            setOpenConfirmationDialog(true);
          } catch (error) {
            console.error("Kļūda audio pārveidošanā:", error);
          }

          streamRef.current.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Kļūda piekļuvei mikrofonam:", error);
      }
    }
  };

  const formatLogEntry = (item) => {
    const action = item.action === 'add' ? 'Pievienots' : 'Izņemts';
    const qty = item.quantity || '1';
    return `${item.manufacturer} ${item.part} ${item.model} ${qty}gab. - ${action}`;
  };

  const processCommand = async (cmd) => {
    try {
      const response = await axios.post('/api/process-command', { command: cmd, language });
      const { changes } = response.data;

      if (Array.isArray(changes)) {
        setConfirmationList(changes);
      } else {
        console.error("Gaidīju izmaiņu masīvu, saņēmu:", changes);
        setConfirmationList([]);
      }

      setOpenConfirmationDialog(true);
    } catch (error) {
      console.error("Kļūda komandas apstrādē:", error);
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
      console.error("Kļūda izmaiņu izpildē:", error);
    }
  };

  return (
    <Stack spacing={3} sx={{ p: 2, height: '100vh' }}>
      <Typography variant="h4">Detaļu pārvaldība</Typography>

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

      <RadioGroup row value={language} onChange={handleLanguageChange}>
        <FormControlLabel value="lv" control={<Radio />} label="Latviešu" />
        <FormControlLabel value="ru" control={<Radio />} label="Krievu" />
      </RadioGroup>

      <TextField
        label="Ievadiet komandu"
        value={command}
        onChange={handleCommandChange}
        fullWidth
        placeholder="Piemēram: Aizmugures spārns BMW, izņemt 3 sensorus no Ford"
        sx={{ mb: 3 }}
      />

      <Button
        variant="outlined"
        onClick={handleVoiceCommand}
        sx={{ mb: 1 }}
      >
        {isRecording ? "🛑 Pārtraukt ierakstu" : "🎤 Izmantot balsi"}
      </Button>

      <Button variant="contained" color="primary" onClick={() => processCommand(command)}>
        Apstrādāt komandu
      </Button>

      <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
        <DialogTitle>Apstiprināt izmaiņas</DialogTitle>
        <DialogContent>
          <Typography>
            Vai vēlaties veikt šādas izmaiņas:
          </Typography>
          <ul>
            {(confirmationList || []).map((item, index) => (
              <li key={index}>{formatLogEntry(item)}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationDialog(false)} color="secondary">
            Atcelt
          </Button>
          <Button onClick={confirmChanges} color="primary">
            Jā
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ManagePartsPage;
