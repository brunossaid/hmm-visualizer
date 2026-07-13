import {
  Box,
  Button,
  Typography,
  TextField,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  Slider,
} from '@mui/material';
import { useState } from 'react';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import Grid from '@mui/material/Grid';
import ProbabilityMatrix from './components/ProbabilityMatrix';
import backgroundPattern from './styles/background';

export default function App() {
  const distributeEqually = (count: number) => {
    const baseValue = Math.floor(100 / count);
    const remainder = 100 - baseValue * count;

    return Array.from({ length: count }, (_, index) =>
      index === count - 1 ? baseValue + remainder : baseValue
    );
  };

  const [numStates, setNumStates] = useState(2);
  const [stateNames, setStateNames] = useState(['Estado 1', 'Estado 2']);
  const [initialProbabilities, setInitialProbabilities] = useState([50, 50]);

  const handleNumStatesChange = (newNumStates: number) => {
    setNumStates(newNumStates);

    setStateNames((currentNames) => {
      const updatedNames = [...currentNames];

      while (updatedNames.length < newNumStates) {
        updatedNames.push(`Estado ${updatedNames.length + 1}`);
      }

      return updatedNames.slice(0, newNumStates);
    });

    setInitialProbabilities(distributeEqually(newNumStates));
  };

  const [numObservations, setNumObservations] = useState(2);
  const [observationNames, setObservationNames] = useState([
    'Observacion 1',
    'Observacion 2',
  ]);

  const handleNumObservationsChange = (newNumObservations: number) => {
    setNumObservations(newNumObservations);

    setObservationNames((currentNames) => {
      const updatedNames = [...currentNames];

      while (updatedNames.length < newNumObservations) {
        updatedNames.push(`Observacion ${updatedNames.length + 1}`);
      }

      return updatedNames.slice(0, newNumObservations);
    });
  };

  const totalInitialProbability = initialProbabilities.reduce(
    (sum, probability) => sum + probability,
    0
  );

  const [transitionMatrix, setTransitionMatrix] = useState([
    [0.5, 0.5],
    [0.5, 0.5],
  ]);

  const [emissionMatrix, setEmissionMatrix] = useState([
    [0.5, 0.5],
    [0.5, 0.5],
  ]);

  const handleCalculate = () => {
    console.log('stateNames', stateNames);
    console.log('observationNames', observationNames);
    console.log('initialProbabilities', initialProbabilities);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',

        backgroundColor: '#000',
        backgroundImage: backgroundPattern,

        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1300,

          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          py: 4,

          backgroundColor: '#0a0a0a',

          border: '1px solid',
          borderColor: 'grey.800',
          boxShadow: '0 10px 40px rgba(0,0,0,.45)',

          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mt: 4,
            textAlign: 'center',
            fontSize: {
              xs: '1.8rem',
              sm: '2.4rem',
              md: '3rem',
            },
          }}
        >
          Modelos Ocultos de Markov
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: 'gray',
            textAlign: 'center',
            fontSize: {
              xs: '1.2rem',
              sm: '1.5rem',
              md: '1.7rem',
            },
          }}
        >
          Simulador
        </Typography>

        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            mt: 2,
            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          {/* ESTADOS */}
          <Divider
            sx={{
              width: '100%',
              '&::before, &::after': {
                borderColor: 'white',
              },
            }}
          >
            <Chip label="Estados" size="medium" color="primary" />
          </Divider>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: 'gray', mt: 1, mb: 2 }}
            >
              Defina la cantidad de estados ocultos del modelo y el nombre de
              cada uno.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {[2, 3, 4, 5].map((n) => (
                <Button
                  key={n}
                  variant={numStates === n ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => handleNumStatesChange(n)}
                  sx={{
                    px: {
                      xs: 3,
                      sm: 5,
                    },
                  }}
                >
                  {n}
                </Button>
              ))}
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mt: 3,
              }}
            >
              <Grid container spacing={1} sx={{ mt: 3 }}>
                {stateNames.map((name, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 12,
                      sm: stateNames.length === 2 ? 6 : 6,
                      md: stateNames.length <= 3 ? 12 / stateNames.length : 4,
                      lg: stateNames.length <= 4 ? 12 / stateNames.length : 3,
                    }}
                  >
                    <TextField
                      label={`Estado ${index + 1}`}
                      value={name}
                      onChange={(e) => {
                        const newNames = [...stateNames];
                        newNames[index] = e.target.value;
                        setStateNames(newNames);
                      }}
                      fullWidth
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* OBSERVACIONES */}
          <Divider
            sx={{
              width: '100%',
              '&::before, &::after': {
                borderColor: 'white',
              },
            }}
          >
            <Chip label="Observaciones" size="medium" color="primary" />
          </Divider>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: 'gray', mt: 1, mb: 2 }}
            >
              Defina la cantidad de simbolos del alfabeto de observacion y el
              nombre de cada uno.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[2, 3, 4, 5, 6].map((n) => (
                <Button
                  key={n}
                  variant={numObservations === n ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => handleNumObservationsChange(n)}
                  sx={{
                    px: {
                      xs: 3,
                      sm: 5,
                    },
                  }}
                >
                  {n}
                </Button>
              ))}
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mt: 3,
              }}
            >
              <Grid container spacing={1} sx={{ mt: 3 }}>
                {observationNames.map((name, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 12,
                      sm: observationNames.length === 2 ? 6 : 6,
                      md:
                        observationNames.length <= 3
                          ? 12 / observationNames.length
                          : 4,
                      lg:
                        observationNames.length <= 4
                          ? 12 / observationNames.length
                          : 3,
                    }}
                  >
                    <TextField
                      key={index}
                      label={`Observación ${index + 1}`}
                      value={name}
                      onChange={(e) => {
                        const newNames = [...observationNames];
                        newNames[index] = e.target.value;
                        setObservationNames(newNames);
                      }}
                      fullWidth
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* PROBABILIDADES INICIALES */}
          <Divider
            sx={{
              width: '100%',
              '&::before, &::after': {
                borderColor: 'white',
              },
            }}
          >
            <Chip
              label="Probabilidades iniciales"
              size="medium"
              color="primary"
            />
          </Divider>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ color: 'gray', mt: 1 }}>
              Defina la probabilidad de que el modelo comience en cada estado.
              La suma total debe ser 100%
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 1,
                color:
                  totalInitialProbability === 100
                    ? 'success.main'
                    : 'warning.main',
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
                const total = initialProbabilities.reduce(
                  (sum, probability) => sum + probability,
                  0
                );

                const currentValue = initialProbabilities[index];
                const available = 100 - total;
                const maxValue = currentValue + available;

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
                        value={initialProbabilities[index]}
                        min={0}
                        max={100}
                        step={1}
                        valueLabelDisplay="auto"
                        onChange={(_, newValue) => {
                          if (typeof newValue !== 'number') return;

                          const otherTotal = initialProbabilities.reduce(
                            (total, probability, currentIndex) =>
                              currentIndex === index
                                ? total
                                : total + probability,
                            0
                          );

                          const maxAllowed = 100 - otherTotal;
                          const limitedValue = Math.min(newValue, maxAllowed);

                          setInitialProbabilities((currentProbabilities) => {
                            const updatedProbabilities = [
                              ...currentProbabilities,
                            ];
                            updatedProbabilities[index] = limitedValue;
                            return updatedProbabilities;
                          });
                        }}
                      />

                      <Typography sx={{ width: 45 }}>
                        {currentValue}%
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
            <Button
              variant="outlined"
              onClick={() =>
                setInitialProbabilities(distributeEqually(numStates))
              }
              sx={{
                display: 'block',
                mx: 'auto',
                mt: 2,
              }}
            >
              Distribuir por igual
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            mt: 2,
            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          {/* MATRIZ DE TRANSICIÓN */}
          <Divider
            sx={{
              width: '100%',
              '&::before, &::after': {
                borderColor: 'white',
              },
            }}
          >
            <Chip label="Matriz de Transición" size="medium" color="primary" />
          </Divider>

          <Typography variant="subtitle1" sx={{ color: 'gray', mt: 1, mb: 2 }}>
            Defina las probabilidades de transición entre los estados ocultos.
            La suma de las probabilidades de cada fila debe ser igual a 1.00.
          </Typography>
          <ProbabilityMatrix
            rowNames={stateNames}
            columnNames={stateNames}
            matrix={transitionMatrix}
            onChange={setTransitionMatrix}
          />

          {/* MATRIZ DE EMISION */}
          <Divider
            sx={{
              width: '100%',
              '&::before, &::after': {
                borderColor: 'white',
              },
            }}
          >
            <Chip label="Matriz de Emisión" size="medium" color="primary" />
          </Divider>

          <Typography variant="subtitle1" sx={{ color: 'gray', mt: 1, mb: 2 }}>
            Defina las probabilidades de emisión de cada símbolo de observación
            para cada estado. La suma de las probabilidades de cada fila debe
            ser igual a 1.00.
          </Typography>
        </Box>

        {/* CALCULAR */}
        <Button
          variant="contained"
          sx={{ my: 2, px: 10 }}
          onClick={handleCalculate}
        >
          Calcular
        </Button>
      </Box>{' '}
    </Box>
  );
}
