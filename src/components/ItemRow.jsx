import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function ItemRow({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(item.name);
  const [draftQty, setDraftQty] = useState(item.quantity);

  const startEdit = () => {
    setEditing(true);
  };
  const cancelEdit = () => {
    setDraftName(item.name);
    setDraftQty(item.quantity);
    setEditing(false);
  };
  const saveEdit = () => {
    onUpdate(item.id, { name: draftName.trim(), quantity: Number(draftQty) });
    setEditing(false);
  };

  return (
    <ListItem
      secondaryAction={
        editing ? (
          <>
            <IconButton aria-label="save" onClick={saveEdit}>
              <CheckIcon />
            </IconButton>
            <IconButton aria-label="cancel" onClick={cancelEdit}>
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton aria-label="edit" onClick={startEdit}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => onDelete(item.id)}>
              <DeleteIcon />
            </IconButton>
          </>
        )
      }
    >
      {editing ? (
        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
          <TextField
            size="small"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
          <TextField
            size="small"
            type="number"
            sx={{ width: 120 }}
            value={draftQty}
            onChange={(e) => setDraftQty(e.target.value)}
          />
        </Stack>
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
