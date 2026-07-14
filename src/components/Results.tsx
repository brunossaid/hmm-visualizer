import {
  Box,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import { calculateForward } from '../algorithms/forward';
import { calculateViterbi } from '../algorithms/viterbi';
import SectionDivider from './SectionDivider';

type ResultsProps = {
  forwardResult: ReturnType<typeof calculateForward> | null;
  viterbiResult: ReturnType<typeof calculateViterbi> | null;
  stateNames: string[];
  observationNames: string[];
  sequence: string[];
};

export default function Results({
  forwardResult,
  viterbiResult,
  stateNames,
  observationNames,
  sequence,
}: ResultsProps) {
  if (!forwardResult || !viterbiResult) {
    return null;
  }

  return (
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
      <SectionDivider label="Resumen" />

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          mt: 1,
        }}
      >
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 0.5,
              color: 'text.secondary',
            }}
          >
            Estados
          </Typography>
          <Stack
            direction="row"
            sx={{
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            {stateNames.map((stateName, index) => (
              <Chip key={`${stateName}-${index}`} label={stateName} />
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 0.5,
              color: 'text.secondary',
            }}
          >
            Observaciones
          </Typography>
          <Stack
            direction="row"
            sx={{
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            {observationNames.map((observationName, index) => (
              <Chip
                key={`${observationName}-${index}`}
                label={observationName}
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 0.5,
            color: 'text.secondary',
          }}
        >
          Secuencia Observada
        </Typography>
        <Stack
          direction="row"
          sx={{
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {sequence.map((observation, index) => (
            <Chip
              key={`${observation}-${index}`}
              label={observation}
              sx={{
                backgroundColor: 'secondary.main',
              }}
            />
          ))}
        </Stack>
      </Box>

      <SectionDivider label="Resultados" />

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Card>
            <CardHeader
              title="Forward"
              sx={{ backgroundColor: 'primary.main' }}
            />
            <CardContent>
              <Typography>
                Probabilidad de observar la secuencia considerando todos los
                caminos posibles
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography>
                Probabilidad total: <strong>{forwardResult.probability}</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Card>
            <CardHeader
              title="Viterbi"
              sx={{ backgroundColor: 'primary.main' }}
            />
            <CardContent>
              <Typography>
                Camino de estados ocultos más probable para la secuencia
                ingresada
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography>
                Probabilidad del mejor camino:
                <strong>{viterbiResult.probability}</strong>
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Secuencia mas probable:
                <strong>{viterbiResult.stateSequenceNames.join(' → ')}</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
