import {
  Container,
  CssBaseline,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import AddItemForm from "../components/AddItemForm";
import ItemsList from "../components/ItemsList";

export default function InventoryPage() {
  const [items, setItems] = useState([]);

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
    //use setItems and filter by ID
  };

  const hasItems = useMemo(() => items.length > 0, [items]);

  return (
    <>
      <CssBaseline />

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Current Inventory
        </Typography>

        <Paper sx={{ mb: 3, p: 2 }}>
          {hasItems ? (
            <>
              <ItemsList
                items={items}
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

        <AddItemForm onAdd={onAdd} />
      </Container>
    </>
  );
}
