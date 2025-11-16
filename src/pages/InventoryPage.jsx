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
  //++++++++++ state variables ++++++++++
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [isManager, setIsManager] = useState(false);

  // ++++++++++ references
  const bottomRef = useRef(null);
  const nameFieldRef = useRef(null);

  // should probably be renamed to scroll to add item as that is what this does. well, it also scrolls.
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      nameFieldRef.current?.focus();
    }, 400);
  };

  // On mount: read currentEmployee from localStorage and extract orgId + role
  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentEmployee");
      if (!raw) {
        setError("No logged-in employee found. Please log in again.");
        setLoading(false);
        return;
      }
      const emp = JSON.parse(raw);
      if (!emp.organizationId) {
        setError("Your account is not linked to an organization.");
        setLoading(false);
        return;
      }
      setOrgId(emp.organizationId);
      setIsManager(emp.role === "Manager");
    } catch (e) {
      console.error(e);
      setError("Failed to read employee info. Please log in again.");
      setLoading(false);
    }
  }, []);

  // READ: load rows for this organization (newest first)
  useEffect(() => {
    if (!orgId) return; // wait until orgId is known

    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("inventory")
          .select("id,item_name,item_quantity,created_at")
          .eq("organization_id", orgId)
          .order("id", { ascending: false });

        if (error) throw error;

        if (alive) {
          const ui = (data ?? []).map((r) => ({
            id: r.id,
            name: r.item_name,
            quantity: r.item_quantity,
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
  }, [orgId]);

  // CREATE: insert then prepend to list
  const onAdd = async ({ name, quantity }) => {
    const trimmed = String(name ?? "").trim();
    const qtyNum = Number(quantity);
    if (!trimmed || Number.isNaN(qtyNum)) return;

    if (!orgId) {
      setError("Missing organization. Please log in again.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const { data, error } = await supabase
        .from("inventory")
        .insert([
          {
            item_name: trimmed,
            item_quantity: qtyNum,
            organization_id: orgId,
          },
        ])
        .select("id,item_name,item_quantity,created_at")
        .single();

      if (error) throw error;

      const inserted = {
        id: data.id,
        name: data.item_name,
        quantity: data.item_quantity,
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

  // UPDATE: still local-only for now
  const onUpdate = (id, patch) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  // DELETE: only managers, and also delete in Supabase
  const onDelete = async (id) => {
    if (!isManager) {
      setError("You do not have permission to delete items.");
      return;
    }

    try {
      setError(null);

      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", id)
        .eq("organization_id", orgId);

      if (error) throw error;

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
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
        {searchTerm === "" ? (
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
                  isManager={isManager}
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
        </div>
      </Container>
    </>
  );
}
