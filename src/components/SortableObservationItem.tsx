import {
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SortableObservationItemProps = {
  id: string;
  position: number;
  observationName: string;
  onDelete: () => void;
};

export default function SortableObservationItem({
  id,
  position,
  observationName,
  onDelete,
}: SortableObservationItemProps) {
  const { setNodeRef, listeners, attributes, transform, transition } =
    useSortable({
      id,
    });

  return (
    <ListItem
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
      }}
      secondaryAction={
        <IconButton
          edge="end"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onClick={onDelete}
          sx={{ mr: 0 }}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Chip label={`${position}`} size="small" />

        <Typography>{observationName}</Typography>
      </Box>
    </ListItem>
  );
}
