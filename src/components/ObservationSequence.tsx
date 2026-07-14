import { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  List,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddRounded';
import SortableObservationItem from './SortableObservationItem';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

type ObservationSequenceProps = {
  observationNames: string[];
  sequence: ObservationSequenceItem[];
  onChange: (sequence: ObservationSequenceItem[]) => void;
};

export type ObservationSequenceItem = {
  id: string;
  observationIndex: number;
};

const MAX_SEQUENCE_LENGTH = 10;

export default function ObservationSequence({
  observationNames,
  sequence,
  onChange,
}: ObservationSequenceProps) {
  const [selectedObservation, setSelectedObservation] = useState<number | null>(
    null
  );

  const options = observationNames.map((name, index) => ({
    label: name,
    value: index,
  }));

  const handleAddObservation = () => {
    if (selectedObservation === null) return;
    if (sequence.length >= MAX_SEQUENCE_LENGTH) return;

    onChange([
      ...sequence,
      {
        id: crypto.randomUUID(),
        observationIndex: selectedObservation,
      },
    ]);

    setSelectedObservation(null);
  };

  const handleDeleteObservation = (indexToDelete: number) => {
    onChange(sequence.filter((_, index) => index !== indexToDelete));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sequence.findIndex((item) => item.id === active.id);
    const newIndex = sequence.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    onChange(arrayMove(sequence, oldIndex, newIndex));
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" sx={{ color: 'gray', mt: 1, mb: 2 }}>
        Seleccione las observaciones en el orden en que fueron emitidas por el
        modelo.
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{
          mt: 1,
        }}
      >
        <Grid
          size={{
            xs: 12,
            md: 5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Autocomplete
              disablePortal
              options={options}
              value={
                options.find(
                  (option) => option.value === selectedObservation
                ) ?? null
              }
              onChange={(_, newValue) => {
                setSelectedObservation(newValue?.value ?? null);
              }}
              sx={{
                flex: 1,
                minWidth: 0,
                maxWidth: 280,
              }}
              renderInput={(params) => (
                <TextField {...params} label="Observación" />
              )}
            />

            <Button
              variant="contained"
              onClick={handleAddObservation}
              disabled={
                selectedObservation === null ||
                sequence.length >= MAX_SEQUENCE_LENGTH
              }
              sx={{
                minWidth: 56,
                width: 56,
                height: 56,
                p: 0,
                borderRadius: 1.5,
              }}
            >
              <AddIcon />
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color:
                sequence.length >= MAX_SEQUENCE_LENGTH
                  ? 'warning.main'
                  : 'text.secondary',
            }}
          >
            {sequence.length} / {MAX_SEQUENCE_LENGTH} observaciones
          </Typography>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 7,
          }}
        >
          {sequence.length === 0 ? (
            <Typography sx={{ mt: 2, color: 'gray' }}>
              Todavía no se agregaron observaciones a la secuencia.
            </Typography>
          ) : (
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext
                items={sequence.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <List
                  sx={{
                    width: '100%',
                    border: '1px solid',
                    borderColor: 'grey.800',
                    borderRadius: 2,
                    overflow: 'hidden',
                    p: 0,
                  }}
                >
                  {sequence.map((item, index) => (
                    <Box key={item.id}>
                      <SortableObservationItem
                        id={item.id}
                        position={index + 1}
                        observationName={
                          observationNames[item.observationIndex]
                        }
                        onDelete={() => handleDeleteObservation(index)}
                      />

                      {index < sequence.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </SortableContext>
            </DndContext>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
