import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Box, Button } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Импортируем useTranslation

const PartsTable = () => {
  const { t } = useTranslation(); // Инициализируем useTranslation

  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get('/api/parts');
        setParts(response.data);
        setFilteredParts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных запчастей:", error);
      }
    };

    fetchParts();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
    const filtered = parts.filter((part) =>
      Object.values(part).some((field) => String(field).toLowerCase().includes(value))
    );
    setFilteredParts(filtered);
  };

  const handleCellEditCommit = async (params) => {
    const { id, field, value } = params;
    try {
      await axios.put(`/api/parts/${id}`, { [field]: value });
      const updatedParts = parts.map((part) =>
        part.id === id ? { ...part, [field]: value } : part
      );
      setParts(updatedParts);
      setFilteredParts(updatedParts);
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    try {
      await axios.delete('/api/parts', { data: { ids: selectedRows } });
      const updatedParts = parts.filter((part) => !selectedRows.includes(part.id));
      setParts(updatedParts);
      setFilteredParts(updatedParts);
      setSelectedRows([]);
    } catch (error) {
      console.error("Ошибка при удалении данных:", error);
    }
  };

  const handleRowSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection);
    console.log("Выбранные строки:", newSelection);
  };

  // Используем t() для перевода заголовков колонок
  const columns = [
    { field: 'id', headerName: t('id'), width: 90 },
    { field: 'manufacturer', headerName: t('manufacturer'), width: 150, editable: true },
    { field: 'part', headerName: t('part'), width: 150, editable: true },
    { field: 'model', headerName: t('model'), width: 150, editable: true },
    { field: 'quantity', headerName: t('quantity'), width: 110, type: 'number', editable: true },
  ];

  if (loading) {
    return <p>{t('loading')}</p>; // Переводим сообщение о загрузке
  }

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <TextField
        label={t('search')} // Переводим метку поля поиска
        variant="outlined"
        value={searchText}
        onChange={handleSearch}
        sx={{ mb: 2 }}
        fullWidth
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDelete}
        disabled={selectedRows.length === 0}
        sx={{ mb: 2 }}
      >
        {t('delete_selected')} {/* Переводим текст кнопки */}
      </Button>
      <DataGrid
        rows={filteredParts}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        checkboxSelection
        disableSelectionOnClick
        disableColumnMenu
        onRowSelectionModelChange={handleRowSelectionModelChange}
        onCellEditCommit={handleCellEditCommit}
      />
    </Box>
  );
};

export default PartsTable;
