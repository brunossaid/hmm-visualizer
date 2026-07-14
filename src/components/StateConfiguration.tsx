import { Box, Button, Grid, TextField, Typography } from '@mui/material';

type StateConfigurationProps = {
  numStates: number;
  stateNames: string[];
  onNumStatesChange: (newNumStates: number) => void;
  onStateNameChange: (index: number, newName: string) => void;
};

export default function StateConfiguration({
  numStates,
  stateNames,
  onNumStatesChange,
  onStateNameChange,
}: StateConfigurationProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" sx={{ color: 'gray', mt: 1, mb: 2 }}>
        Defina la cantidad de estados ocultos del modelo y el nombre de cada
        uno.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {[2, 3, 4, 5].map((number) => (
          <Button
            key={number}
            variant={numStates === number ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => onNumStatesChange(number)}
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
        {stateNames.map((name, index) => (
          <Grid
            key={index}
            size={{
              xs: 12,
              sm: 6,
              md: stateNames.length <= 3 ? 12 / stateNames.length : 4,
              lg: stateNames.length <= 4 ? 12 / stateNames.length : 3,
            }}
          >
            <TextField
              label={`Estado ${index + 1}`}
              value={name}
              onChange={(event) => onStateNameChange(index, event.target.value)}
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
