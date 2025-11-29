// src/hooks/useInventory.js
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

/**
 * Handles all inventory data concerns for a given organization:
 * - loading inventory from Supabase
 * - inserting new items
 * - deleting items (with manager check)
 * - local-only updates
 *
 * Returns:
 * - items, loading, saving, error
 * - addItem({ name, quantity })
 * - updateItemLocal(id, patch)
 * - deleteItem(id)
 * - setError (if caller wants to override/clear)
 */
export default function useInventory(orgId, isManager) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // READ: load rows for this organization (newest first)
  useEffect(() => {
    if (!orgId) {
      // No org yet — clear items & loading state
      setItems([]);
      setLoading(false);
      return;
    }

    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supaError } = await supabase
          .from("inventory")
          .select("id,item_name,item_quantity,created_at")
          .eq("organization_id", orgId)
          .order("id", { ascending: false });

        if (supaError) throw supaError;

        if (!alive) return;

        const uiItems = (data ?? []).map((r) => ({
          id: r.id,
          name: r.item_name,
          quantity: r.item_quantity,
          createdAt: r.created_at ?? null,
        }));

        setItems(uiItems);
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
  const addItem = async ({ name, quantity }) => {
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

      const { data, error: supaError } = await supabase
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

      if (supaError) throw supaError;

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

  // UPDATE: persist to Supabase and then update local state
  const updateItem = async (id, patch) => {
    if (!orgId) {
      setError("Missing organization. Please log in again.");
      return;
    }

    // Map UI patch -> DB columns
    const updates = {};
    if (patch.name !== undefined) {
      const trimmedName = String(patch.name ?? "").trim();
      if (!trimmedName) {
        setError("Item name cannot be empty.");
        return;
      }
      updates.item_name = trimmedName;
    }

    if (patch.quantity !== undefined) {
      const qtyNum = Number(patch.quantity);
      if (Number.isNaN(qtyNum)) {
        setError("Quantity must be a number.");
        return;
      }
      updates.item_quantity = qtyNum;
    }

    // Nothing to update
    if (Object.keys(updates).length === 0) return;

    try {
      setSaving(true);
      setError(null);

      const { data, error: supaError } = await supabase
        .from("inventory")
        .update(updates)
        .eq("id", id)
        .eq("organization_id", orgId)
        .select("id,item_name,item_quantity,created_at")
        .single();

      if (supaError) throw supaError;

      const updated = {
        id: data.id,
        name: data.item_name,
        quantity: data.item_quantity,
        createdAt: data.created_at ?? null,
      };

      // Update local list with the saved row
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // DELETE: only managers, and also delete in Supabase
  const deleteItem = async (id) => {
    if (!isManager) {
      setError("You do not have permission to delete items.");
      return;
    }

    if (!orgId) {
      setError("Missing organization. Please log in again.");
      return;
    }

    try {
      setError(null);

      const { error: supaError } = await supabase
        .from("inventory")
        .delete()
        .eq("id", id)
        .eq("organization_id", orgId);

      if (supaError) throw supaError;

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return {
    items,
    loading,
    saving,
    error,
    addItem,
    updateItem,
    deleteItem,
    setError,
  };
}
