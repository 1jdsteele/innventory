import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { IconButton, ListItem, ListItemText, TextField } from "@mui/material";
import { useState } from "react";

export default function ItemRow({ item, onUpdate, onDelete, isManager }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(item.name);
  const [draftQty, setDraftQty] = useState(item.quantity);
  const [draftLowThreshold, setDraftLowThreshold] = useState(
    item.lowThreshold ?? 0
  );

  const handleSave = () => {
    const name = draftName.trim();
    const quantity = Number(draftQty);
    if (!name || Number.isNaN(quantity)) return;

    const patch = { name, quantity };

    if (isManager) {
      const lowThresholdNum = Number(draftLowThreshold);
      if (Number.isNaN(lowThresholdNum) || lowThresholdNum < 0) {
        // simple guard; you could show a toast instead
        return;
      }
      patch.lowThreshold = lowThresholdNum;
    }

    onUpdate(item.id, patch);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraftName(item.name);
    setDraftQty(item.quantity);
    setDraftLowThreshold(item.lowThreshold ?? 0);
  };

  return (
    <ListItem
      secondaryAction={
        isEditing ? (
          <>
            <IconButton
              aria-label="save"
              edge="end"
              onClick={handleSave}
              sx={{ mr: -0.5 }}
            >
              <SaveIcon />
            </IconButton>
            <IconButton aria-label="cancel" edge="end" onClick={handleCancel}>
              <CancelIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              aria-label="edit"
              edge="end"
              onClick={() => setIsEditing(true)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              edge="end"
              onClick={() => onDelete(item.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )
      }
    >
      {isEditing ? (
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "100%",
            paddingRight: "40px",
          }}
        >
          <TextField
            label="Name"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Quantity"
            type="number"
            value={draftQty}
            onChange={(e) => setDraftQty(e.target.value)}
            size="small"
            sx={{ maxWidth: 120 }}
          />
          {isManager && (
            <TextField
              label="Low threshold"
              type="number"
              value={draftLowThreshold}
              onChange={(e) => setDraftLowThreshold(e.target.value)}
              size="small"
              sx={{ maxWidth: 140 }}
            />
          )}
        </div>
      ) : (
        <ListItemText
          primary={item.name}
          secondary={`Quantity: ${item.quantity}`}
          primaryTypographyProps={{ fontWeight: "bold" }}
        />
      )}
    </ListItem>
  );
}
