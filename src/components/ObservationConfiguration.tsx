import { Box, Button, Grid, TextField, Typography } from '@mui/material';

type ObservationConfigurationProps = {
  numObservations: number;
  observationNames: string[];
  onNumObservationsChange: (newNumObservations: number) => void;
  onObservationNameChange: (index: number, newName: string) => void;
};

export default function ObservationConfiguration({
  numObservations,
  observationNames,
  onNumObservationsChange,
  onObservationNameChange,
}: ObservationConfigurationProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" sx={{ color: 'gray', mt: 1, mb: 2 }}>
        Defina la cantidad de símbolos del alfabeto de observación y el nombre
        de cada uno.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {[2, 3, 4, 5, 6].map((number) => (
          <Button
            key={number}
            variant={numObservations === number ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => onNumObservationsChange(number)}
            sx={{
              px: {
                xs: 3,
                sm: 5,
              },
            }}
          >
            {number}
          </Button>
        ))}
      </Box>

      <Grid container spacing={1} sx={{ mt: 3 }}>
        {observationNames.map((name, index) => (
          <Grid
            key={index}
            size={{
              xs: 12,
              sm: 6,
              md:
                observationNames.length <= 3 ? 12 / observationNames.length : 4,
              lg:
                observationNames.length <= 4 ? 12 / observationNames.length : 3,
            }}
          >
            <TextField
              label={`Observación ${index + 1}`}
              value={name}
              onChange={(event) =>
                onObservationNameChange(index, event.target.value)
              }
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
