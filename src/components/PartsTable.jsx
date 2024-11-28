import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Box, Button } from '@mui/material';
import axios from 'axios';

const PartsTable = () => {
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
        console.error("Kļūda, ielādējot detaļas:", error);
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
      console.error("Kļūda, atjauninot datus:", error);
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
      console.error("Kļūda, dzēšot datus:", error);
    }
  };

  const handleRowSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection);
    console.log("Izvēlētās rindas:", newSelection);
  };

  // Заменяем заголовки колонок на латышские слова
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'manufacturer', headerName: 'Ražotājs', width: 150, editable: true },
    { field: 'model', headerName: 'Modelis', width: 150, editable: true },
    { field: 'part', headerName: 'Detaļa', width: 150, editable: true },
    { field: 'quantity', headerName: 'Daudzums', width: 110, type: 'number', editable: true },
  ];

  if (loading) {
    return <p>Ielādē...</p>; // Сообщение о загрузке на латышском
  }

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <TextField
        label="Meklēt" // Метка поля поиска на латышском
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
        Dzēst izvēlētos {/* Текст кнопки на латышском */}
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
