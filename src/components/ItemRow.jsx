import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton, ListItem, ListItemText, TextField } from "@mui/material";
import { useState } from "react";

export default function ItemRow({ item, onUpdate, onDelete }) {
  // HERE hein will add logic for editing
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(item.name);
  const [draftQty, setDraftQty] = useState(item.quantity);

  const handleSave = () => {
    const name = draftName.trim();
    const quantity = Number(draftQty);
    if (!name || Number.isNaN(quantity)) return;
    onUpdate(item.id, { name, quantity });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraftName(item.name);
    setDraftQty(item.quantity);
  };

  return (
    //HERE Hein will add ternary logic to have the list item we are editing go to "edit mode"
    <ListItem
      // MUI prop that allows right-side icons
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
            <IconButton 
              aria-label="cancel"
              edge="end"
              onClick={handleCancel}>
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
        <div style={{ display: "flex", gap: "10px", width: "100%", paddingRight: "40px" }}>
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
          />
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