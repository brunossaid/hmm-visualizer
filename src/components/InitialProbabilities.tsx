import TripOriginIcon from '@mui/icons-material/TripOrigin';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Slider,
  Typography,
} from '@mui/material';

type InitialProbabilitiesProps = {
  stateNames: string[];
  initialProbabilities: number[];
  totalInitialProbability: number;
  onProbabilityChange: (index: number, newValue: number) => void;
  onDistributeEqually: () => void;
};

export default function InitialProbabilities({
  stateNames,
  initialProbabilities,
  totalInitialProbability,
  onProbabilityChange,
  onDistributeEqually,
}: InitialProbabilitiesProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ color: 'gray', mt: 1 }}>
        Defina la probabilidad de que el modelo comience en cada estado. La suma
        total debe ser 100%.
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mt: 1,
          color:
            totalInitialProbability === 100 ? 'success.main' : 'warning.main',
        }}
      >
        {totalInitialProbability === 100
          ? 'Suma total: 100%. Para aumentar una probabilidad, primero reduzca otra.'
          : `Suma total: ${totalInitialProbability}%. Restan ${
              100 - totalInitialProbability
            }% por asignar.`}
      </Typography>

      <List>
        {stateNames.map((name, index) => {
          const currentValue = initialProbabilities[index];

          return (
            <ListItem
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Box
                sx={{
                  width: 180,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <TripOriginIcon color="primary" />
                </ListItemIcon>

                <Typography>{name}</Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Slider
                  value={currentValue}
                  min={0}
                  max={100}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={(_, newValue) => {
                    if (typeof newValue !== 'number') return;

                    onProbabilityChange(index, newValue);
                  }}
                />

                <Typography sx={{ width: 45 }}>{currentValue}%</Typography>
              </Box>
            </ListItem>
          );
        })}
      </List>

      <Button
        variant="outlined"
        onClick={onDistributeEqually}
        sx={{
          display: 'block',
          mx: 'auto',
          mt: 2,
        }}
      >
        Distribuir por igual
      </Button>
    </Box>
  );
}
