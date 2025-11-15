import {
  Alert,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import AddItemForm from "../components/AddItemForm";
import DashboardHeader from "../components/DashboardHeader";
import ItemsList from "../components/ItemsList";
import SearchBar from "../components/SearchBar";
import { supabase } from "../services/supabaseClient";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // ref to the bottom section (AddItemForm)
  const bottomRef = useRef(null);
  const nameFieldRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("hit it");
    setTimeout(() => {
      nameFieldRef.current?.focus();
    }, 400);
    console.log("hit the bottom");
  };

  // READ: load rows on mount (newest first)
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from("Inventory")
          .select("id,item_name,item_quantity,organization,created_at")
          .order("id", { ascending: false });
        if (error) throw error;
        if (alive) {
          // map DB -> UI shape used by ItemsList/ItemRow
          const ui = (data ?? []).map((r) => ({
            id: r.id,
            name: r.item_name,
            quantity: r.item_quantity,
            organization: r.organization ?? null,
            createdAt: r.created_at ?? null,
          }));
          setItems(ui);
        }
      } catch (err) {
        console.error(err);
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  // CREATE: insert then prepend to list
  const onAdd = async ({ name, quantity }) => {
    const trimmed = String(name ?? "").trim();
    const qtyNum = Number(quantity);
    if (!trimmed || Number.isNaN(qtyNum)) return;

    try {
      setSaving(true);
      setError(null);

      const { data, error } = await supabase
        .from("Inventory")
        .insert([
          {
            item_name: trimmed,
            item_quantity: qtyNum,
            // add organization if your form supports it:
            // organization: org || null,
          },
        ])
        .select("id,item_name,item_quantity,organization,created_at")
        .single();

      if (error) throw error;

      // map DB -> UI shape and prepend
      const inserted = {
        id: data.id,
        name: data.item_name,
        quantity: data.item_quantity,
        organization: data.organization ?? null,
        createdAt: data.created_at ?? null,
      };
      setItems((prev) => [inserted, ...prev]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Local update/delete remain as-is (wire to Supabase later if you like)
  const onUpdate = (id, patch) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const onDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
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
        <DashboardHeader title="XXX" onScrollToBottom={scrollToBottom} />
        {searchTerm == "" ? (
          <Typography variant="h4" gutterBottom>
            Current Inventory
          </Typography>
        ) : (
          <Typography variant="h4" gutterBottom>
            Search results:
          </Typography>
        )}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper sx={{ mb: 3, p: 2, minHeight: 120 }}>
            {loading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={20} />
                <Typography color="text.secondary">Loading…</Typography>
              </Stack>
            ) : hasItems ? (
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
        <div ref={bottomRef}>
          <AddItemForm onAdd={onAdd} nameRef={nameFieldRef} />
        </div>{" "}
      </Container>
    </>
  );
}
