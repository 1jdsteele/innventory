import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Inventory() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim() || !quantity.trim()) return;

    const newItem = { name: itemName, qty: quantity };
    setItems([newItem, ...items]);

    setItemName("");
    setQuantity("");
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Current Inventory
      </Typography>

      {items.length === 0 ? (
        <Typography color="text.secondary">No items yet.</Typography>
      ) : (
        <Paper sx={{ mb: 3, p: 2 }}>
          <List>
            {items.map((item, i) => (
              <Box key={i}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography fontWeight="bold">{item.name}</Typography>
                    }
                    secondary={`Quantity: ${item.qty}`}
                  />
                </ListItem>
                {i < items.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>
      )}

      <Paper sx={{ p: 3, maxWidth: 400, margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Item name"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Quantity"
              type="number"
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" type="submit">
              Add Item
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
