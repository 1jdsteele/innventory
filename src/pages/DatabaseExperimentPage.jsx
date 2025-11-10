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
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function DatabaseExperimentPage() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("Inventory")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        setItems(data ?? []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !itemQuantity.trim()) return;

    try {
      setSaving(true);
      setError(null);

      const { data, error } = await supabase
        .from("Inventory")
        .insert([
          {
            item_name: itemName.trim(),
            item_quantity: Number(itemQuantity),
            organization: organization.trim() || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setItems((prev) => [data, ...prev]);

      setItemName("");
      setItemQuantity("");
      setOrganization("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Database Experiment
      </Typography>

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: "#ffebee" }}>
          <Typography color="error">Error: {error}</Typography>
        </Paper>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current rows
        </Typography>

        {loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : items.length === 0 ? (
          <Typography color="text.secondary">No rows found.</Typography>
        ) : (
          <List>
            {items.map((row) => (
              <Box key={row.id}>
                <ListItem>
                  <ListItemText
                    primary={`${row.item_name} (qty: ${row.item_quantity})`}
                    secondary={
                      <>
                        {row.organization && (
                          <span>Org: {row.organization} • </span>
                        )}
                        {row.created_at && (
                          <span>
                            Created: {new Date(row.created_at).toLocaleString()}
                          </span>
                        )}
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Insert a new row
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Item quantity"
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              fullWidth
            />
            <TextField
              label="Organization (optional)"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Saving..." : "Add to Inventory table"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
