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
import { supabase } from "../services/supabaseClient";

export default function Inventory() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // helper: DB row -> UI shape
  const fromDb = (row) => ({
    id: row.id,
    name: row.item_name,
    qty: row.item_quantity,
    organization: row.organization ?? null,
    createdAt: row.created_at ?? null,
  });

  // READ: load rows on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from("Inventory")
          .select("*")
          .order("id", { ascending: false }); // newest first
        if (error) throw error;
        setItems((data ?? []).map(fromDb));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // CREATE: insert a new row
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !quantity.toString().trim()) return;

    try {
      setSaving(true);
      setError(null);

      const payload = {
        item_name: itemName.trim(),
        item_quantity: Number(quantity),
        // add organization here if you want: organization: "Acme"
      };

      const { data, error } = await supabase
        .from("Inventory")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      // prepend inserted row
      setItems((prev) => [fromDb(data), ...prev]);

      setItemName("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Current Inventory
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ my: 2 }}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">Loading…</Typography>
        </Stack>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">No items yet.</Typography>
      ) : (
        <Paper sx={{ mb: 3, p: 2 }}>
          <List>
            {items.map((item, i) => (
              <Box key={item.id ?? i}>
                <ListItem>
                  <ListItemText
                    primary={<Typography fontWeight="bold">{item.name}</Typography>}
                    secondary={
                      <>
                        Quantity: {item.qty}
                        {item.organization ? ` • Org: ${item.organization}` : ""}
                        {item.createdAt ? ` • Created: ${new Date(item.createdAt).toLocaleString()}` : ""}
                      </>
                    }
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
              inputProps={{ min: 0 }}
            />
            <Button variant="contained" color="primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Add Item"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
