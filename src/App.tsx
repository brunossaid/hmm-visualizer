import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import ProbabilityMatrix from './components/ProbabilityMatrix';
import backgroundPattern from './styles/background';
import SectionDivider from './components/SectionDivider';
import StateConfiguration from './components/StateConfiguration';
import ObservationConfiguration from './components/ObservationConfiguration';
import InitialProbabilities from './components/InitialProbabilities';
import ObservationSequence, {
  type ObservationSequenceItem,
} from './components/ObservationSequence';
import { calculateForward } from './algorithms/forward';
import { calculateViterbi } from './algorithms/viterbi';
import Results from './components/Results';

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

    setTransitionMatrix(createEqualMatrix(newNumStates, newNumStates));
    setEmissionMatrix(createEqualMatrix(newNumStates, numObservations));
  };

  const handleStateNameChange = (index: number, newName: string) => {
    setStateNames((currentNames) => {
      const updatedNames = [...currentNames];
      updatedNames[index] = newName;

      return updatedNames;
    });
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
        updatedNames.push(`Observación ${updatedNames.length + 1}`);
      }

      return updatedNames.slice(0, newNumObservations);
    });

    setEmissionMatrix(createEqualMatrix(numStates, newNumObservations));
  };

  const handleObservationNameChange = (index: number, newName: string) => {
    setObservationNames((currentNames) => {
      const updatedNames = [...currentNames];
      updatedNames[index] = newName;

      return updatedNames;
    });
  };

  const totalInitialProbability = initialProbabilities.reduce(
    (sum, probability) => sum + probability,
    0
  );

  const handleInitialProbabilityChange = (index: number, newValue: number) => {
    const otherTotal = initialProbabilities.reduce(
      (total, probability, currentIndex) =>
        currentIndex === index ? total : total + probability,
      0
    );

    const maxAllowed = 100 - otherTotal;
    const limitedValue = Math.min(newValue, maxAllowed);

    setInitialProbabilities((currentProbabilities) => {
      const updatedProbabilities = [...currentProbabilities];
      updatedProbabilities[index] = limitedValue;

      return updatedProbabilities;
    });
  };

  const handleDistributeInitialProbabilities = () => {
    setInitialProbabilities(distributeEqually(numStates));
  };

  const createEqualMatrix = (rows: number, columns: number) => {
    const totalUnits = 100;
    const baseUnits = Math.floor(totalUnits / columns);
    const remainder = totalUnits % columns;

    const row = Array.from({ length: columns }, (_, index) => {
      const units = baseUnits + (index < remainder ? 1 : 0);

      return units / 100;
    });

    return Array.from({ length: rows }, () => [...row]);
  };

  const [transitionMatrix, setTransitionMatrix] = useState(() =>
    createEqualMatrix(2, 2)
  );

  const [emissionMatrix, setEmissionMatrix] = useState(() =>
    createEqualMatrix(2, 2)
  );

  const [observationSequence, setObservationSequence] = useState<
    ObservationSequenceItem[]
  >([]);

  const [showResults, setShowResults] = useState(false);

  const [forwardResult, setForwardResult] = useState<ReturnType<
    typeof calculateForward
  > | null>(null);

  const [viterbiResult, setViterbiResult] = useState<ReturnType<
    typeof calculateViterbi
  > | null>(null);

  const observationSequenceNames = observationSequence.map(
    (item) => observationNames[item.observationIndex]
  );

  const handleCalculate = () => {
    const normalizedInitialProbabilities = initialProbabilities.map(
      (value) => value / 100
    );

    const data = {
      stateNames,
      observationNames,
      initialProbabilities: normalizedInitialProbabilities,
      transitionMatrix,
      emissionMatrix,
      observationSequenceNames,
    };

    const calculatedForwardResult = calculateForward(data);
    const calculatedViterbiResult = calculateViterbi(data);

    setForwardResult(calculatedForwardResult);
    setViterbiResult(calculatedViterbiResult);

    console.log('forward:', calculatedForwardResult);
    console.log('viterbi:', calculatedViterbiResult);
    console.log('data:', data);

    setShowResults(true);
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
          minHeight: '100vh',

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
            fontStyle: 'italic',
            fontSize: {
              xs: '1.2rem',
              sm: '1.5rem',
              md: '1.7rem',
            },
          }}
        >
          Forward & Viterbi
        </Typography>

        {showResults ? (
          <Results
            forwardResult={forwardResult}
            viterbiResult={viterbiResult}
            stateNames={stateNames}
            observationNames={observationNames}
            sequence={observationSequenceNames}
          />
        ) : (
          <>
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
              <SectionDivider label="Estados" />

              <StateConfiguration
                numStates={numStates}
                stateNames={stateNames}
                onNumStatesChange={handleNumStatesChange}
                onStateNameChange={handleStateNameChange}
              />

              {/* OBSERVACIONES */}
              <SectionDivider label="Observaciones" />

              <ObservationConfiguration
                numObservations={numObservations}
                observationNames={observationNames}
                onNumObservationsChange={handleNumObservationsChange}
                onObservationNameChange={handleObservationNameChange}
              />

              {/* PROBABILIDADES INICIALES */}
              <SectionDivider label="Probabilidades Iniciales" />

              <InitialProbabilities
                stateNames={stateNames}
                initialProbabilities={initialProbabilities}
                totalInitialProbability={totalInitialProbability}
                onProbabilityChange={handleInitialProbabilityChange}
                onDistributeEqually={handleDistributeInitialProbabilities}
              />

              {/* MATRIZ DE TRANSICIÓN */}
              <SectionDivider label="Matriz de Transición" />

              <ProbabilityMatrix
                description="Defina las probabilidades de transición entre los estados ocultos. La suma de las probabilidades de cada fila debe ser igual a 1.00."
                rowNames={stateNames}
                columnNames={stateNames}
                matrix={transitionMatrix}
                onChange={setTransitionMatrix}
              />

              {/* MATRIZ DE EMISION */}
              <SectionDivider label="Matriz de Emisión" />

              <ProbabilityMatrix
                description="Defina las probabilidades de emisión de cada símbolo de observación para cada estado. La suma de las probabilidades de cada fila debe ser igual a 1.00."
                rowNames={stateNames}
                columnNames={observationNames}
                matrix={emissionMatrix}
                onChange={setEmissionMatrix}
              />

              <SectionDivider label="Secuencia de observaciones" />
              <ObservationSequence
                observationNames={observationNames}
                sequence={observationSequence}
                onChange={setObservationSequence}
              />
            </Box>
          </>
        )}
        {/* CALCULAR / VOLVER */}
        <Button
          variant="contained"
          sx={{ mb: 2, px: 10, mt: 'auto' }}
          onClick={showResults ? () => setShowResults(false) : handleCalculate}
        >
          {showResults ? 'Volver' : 'Calcular'}
        </Button>
      </Box>
    </Box>
  );
}
