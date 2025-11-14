import {
  Container,
  CssBaseline,
  Divider,
  Paper,
  Typography,
  Stack
} from "@mui/material";
import { useMemo, useState } from "react";
import AddItemForm from "../components/AddItemForm";
import ItemsList from "../components/ItemsList";
import SearchBar from "../components/SearchBar"; 

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(" ");

  const onAdd = ({ name, quantity }) => {
    const newItem = {
      id: crypto.randomUUID(), // unique id "randomly " generated for edit/delete
      name: name.trim(),
      quantity: Number(quantity),
    };
    setItems((prev) => [newItem, ...prev]);
  };

  // Updaing the inventory name and amount
  const onUpdate = (id, patch) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const onDelete = (id) => {
    
    // HERE VInce will make delete logic
    // use setItems and filter by ID
    setItems((prevItems) => prevItems.filter((item) => item.id != id))
  };

    const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, searchTerm]);

  const hasItems = useMemo(() => filteredItems.length > 0, [filteredItems]);

  return (
    <>
      <CssBaseline />

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Current Inventory
        </Typography>
           <Stack spacing={2} sx={{ mb: 3 }}>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <Paper sx={{ mb: 3, p: 2 }}>
          {hasItems ? (
            <>
              <ItemsList
                items={filteredItems}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Total items: {items.length}
              </Typography>
            </>
          ) : (
            <Typography color="text.secondary">No items yet.</Typography>
          )}
        </Paper>
        </Stack>
        <AddItemForm onAdd={onAdd} />
      </Container>
    </>
  );
}
