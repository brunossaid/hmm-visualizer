type ViterbiParams = {
  stateNames: string[];
  observationNames: string[];
  initialProbabilities: number[];
  transitionMatrix: number[][];
  emissionMatrix: number[][];
  observationSequenceNames: string[];
};

export function calculateViterbi({
  stateNames,
  observationNames,
  initialProbabilities,
  transitionMatrix,
  emissionMatrix,
  observationSequenceNames,
}: ViterbiParams) {
  // nombres de observaciones a indices
  const observationIndexes = observationSequenceNames.map((observation) =>
    observationNames.indexOf(observation)
  );

  // cantidad de estados = cantidad de probabilidades iniciales
  const numberOfStates = initialProbabilities.length;

  // cuantos pasos tendra la matriz viterbi
  const sequenceLength = observationIndexes.length;

  // creamos la matriz inicialmente llena de ceros
  // filas = observaciones
  // columnas = estados
  const viterbiMatrix = Array.from({ length: sequenceLength }, () =>
    Array(numberOfStates).fill(0)
  );

  // creamos la matriz que guarda desde que estado vino cada valor
  const backpointerMatrix = Array.from({ length: sequenceLength }, () =>
    Array(numberOfStates).fill(-1)
  );

  // indice de la primera observacion
  const firstObservation = observationIndexes[0];

  // EMPIEZA EL ALGORITMO VITERBI
  // para cada estado, probabilidad inicial x probabilidad de emitir la primera observacion
  for (let state = 0; state < numberOfStates; state++) {
    viterbiMatrix[0][state] =
      initialProbabilities[state] * emissionMatrix[state][firstObservation];
  }

  // recorremos el resto de las observaciones
  // arranca en 1 porque la posicion 0 ya se calculo
  for (let t = 1; t < sequenceLength; t++) {
    const currentObservation = observationIndexes[t];

    // calculamos la probabilidad para cada estado actual
    for (let currentState = 0; currentState < numberOfStates; currentState++) {
      let maximumProbability = -1;
      let bestPreviousState = -1;

      // recorremos todos los estados anteriores posibles
      for (
        let previousState = 0;
        previousState < numberOfStates;
        previousState++
      ) {
        // prob del mejor camino anterior x prob de transicion
        const candidateProbability =
          viterbiMatrix[t - 1][previousState] *
          transitionMatrix[previousState][currentState];

        // guardamos la probabilidad mas alta y desde que estado vino
        if (candidateProbability > maximumProbability) {
          maximumProbability = candidateProbability;
          bestPreviousState = previousState;
        }
      }

      // multiplicamos el mejor camino x la prob de emitir la observacion actual
      viterbiMatrix[t][currentState] =
        maximumProbability * emissionMatrix[currentState][currentObservation];

      // guardamos desde que estado vino el mejor camino
      backpointerMatrix[t][currentState] = bestPreviousState;
    }
  }

  // buscamos el valor mas alto de la ultima fila
  let probability = -1;
  let bestFinalState = -1;

  for (let state = 0; state < numberOfStates; state++) {
    const finalProbability = viterbiMatrix[sequenceLength - 1][state];

    if (finalProbability > probability) {
      probability = finalProbability;
      bestFinalState = state;
    }
  }

  // creamos la secuencia de estados inicialmente vacia
  const stateSequenceIndexes = Array(sequenceLength).fill(-1);

  // guardamos el mejor estado final
  stateSequenceIndexes[sequenceLength - 1] = bestFinalState;

  // recorremos los punteros hacia atras
  for (let t = sequenceLength - 1; t > 0; t--) {
    const currentState = stateSequenceIndexes[t];

    stateSequenceIndexes[t - 1] = backpointerMatrix[t][currentState];
  }

  // convertimos los indices de los estados a nombres
  const stateSequenceNames = stateSequenceIndexes.map(
    (stateIndex) => stateNames[stateIndex]
  );

  // devolvemos la probabilidad, la secuencia y las matrices completas
  return {
    probability,
    stateSequenceIndexes,
    stateSequenceNames,
    viterbiMatrix,
    backpointerMatrix,
  };
}
