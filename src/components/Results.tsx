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
  Avatar,
  Fade,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Button,
} from '@mui/material';
import { calculateForward } from '../hmm/forward';
import { calculateViterbi } from '../hmm/viterbi';
import SectionDivider from './SectionDivider';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffRounded';

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

  function formatProbability(value: number) {
    if (value === 0) return '0';

    if (Math.abs(value) < 0.000001) {
      const [mantissa, exponent] = value.toExponential(4).split('e');

      const superscript: Record<string, string> = {
        '-': '⁻',
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹',
      };

      const exponentText = exponent
        .split('')
        .map((char) => superscript[char] ?? char)
        .join('');

      return `${mantissa} × 10${exponentText}`;
    }

    return value.toFixed(6);
  }

  const [showForwardTable, setShowForwardTable] = useState(false);
  const [showViterbiTable, setShowViterbiTable] = useState(false);

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
          Secuencia observada
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
              avatar={
                <Avatar sx={{ backgroundColor: 'primary.main' }}>
                  {index + 1}
                </Avatar>
              }
              label={observation}
              sx={{
                backgroundColor: 'secondary.main',
              }}
            />
          ))}
        </Stack>
      </Box>

      <SectionDivider label="Resultados" />
      <Fade in timeout={300}>
        <Grid container spacing={2} sx={{ my: 3 }}>
          <Grid
            size={{
              xs: 12,
              md: showForwardTable ? 12 : 6,
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
                <Typography variant="subtitle2">Probabilidad total</Typography>
                <Typography variant="h5">
                  {formatProbability(forwardResult.probability)}
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={
                    showForwardTable ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )
                  }
                  onClick={() => setShowForwardTable((current) => !current)}
                  sx={{ mt: 2, px: 3 }}
                >
                  {showForwardTable ? 'Ocultar tabla' : 'Ver tabla'}
                </Button>
                {showForwardTable && (
                  <TableContainer
                    sx={{
                      mt: 2,
                      border: '1px solid',
                      borderColor: 'grey.800',
                      borderRadius: 2,
                    }}
                  >
                    <Table
                      size="small"
                      sx={{
                        color: 'white',
                        '& .MuiTableCell-root': { borderColor: 'gray' },
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>

                          {stateNames.map((stateName, index) => (
                            <TableCell
                              key={`${stateName}-${index}`}
                              align="center"
                            >
                              {stateName}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {forwardResult.forwardMatrix.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            <TableCell>{sequence[rowIndex]}</TableCell>

                            {row.map((probability, columnIndex) => (
                              <TableCell key={columnIndex} align="center">
                                {probability.toFixed(4)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: showViterbiTable ? 12 : 6,
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
                <Typography variant="subtitle2">
                  Probabilidad del mejor camino
                </Typography>
                <Typography variant="h5">
                  {formatProbability(viterbiResult.probability)}
                </Typography>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                  Secuencia mas probable
                </Typography>
                <Stack
                  direction="row"
                  sx={{
                    gap: 1,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  {viterbiResult.stateSequenceNames.map((state, index) => (
                    <Box
                      key={`${state}-${index}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Chip label={state} />
                    </Box>
                  ))}
                </Stack>
                <Button
                  variant="outlined"
                  startIcon={
                    showViterbiTable ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )
                  }
                  onClick={() => setShowViterbiTable((current) => !current)}
                  sx={{ mt: 3, px: 3 }}
                >
                  {showViterbiTable ? 'Ocultar tabla' : 'Ver tabla'}
                </Button>
                {showViterbiTable && (
                  <TableContainer
                    sx={{
                      mt: 2,
                      border: '1px solid',
                      borderColor: 'grey.800',
                      borderRadius: 2,
                    }}
                  >
                    <Table
                      size="small"
                      sx={{
                        color: 'white',
                        '& .MuiTableCell-root': { borderColor: 'gray' },
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>

                          {stateNames.map((stateName, index) => (
                            <TableCell
                              key={`${stateName}-${index}`}
                              align="center"
                            >
                              {stateName}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {viterbiResult.viterbiMatrix.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            <TableCell>{sequence[rowIndex]}</TableCell>

                            {row.map((probability, columnIndex) => (
                              <TableCell key={columnIndex} align="center">
                                {probability.toFixed(4)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Fade>
    </Box>
  );
}
