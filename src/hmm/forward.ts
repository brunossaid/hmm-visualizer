type ForwardParams = {
  observationNames: string[];
  initialProbabilities: number[];
  transitionMatrix: number[][];
  emissionMatrix: number[][];
  observationSequenceNames: string[];
};

export function calculateForward({
  observationNames,
  initialProbabilities,
  transitionMatrix,
  emissionMatrix,
  observationSequenceNames,
}: ForwardParams) {
  // nombres de observaciones a indices
  const observationIndexes = observationSequenceNames.map((observation) =>
    observationNames.indexOf(observation)
  );

  // cantidad de estados = cantidad de probabilidades iniciales
  const numberOfStates = initialProbabilities.length;

  // cuantos pasos tendra la matriz forward
  const sequenceLength = observationIndexes.length;

  // creamos la matriz inicialmente llena de ceros
  // filas = observaciones
  // columnas = estados
  const forwardMatrix = Array.from({ length: sequenceLength }, () =>
    Array(numberOfStates).fill(0)
  );

  // indice de la primera observacion
  const firstObservation = observationIndexes[0];

  // EMPIEZA EL ALGORITMO FORWARD
  // para cada estado, probabilidad inicial × probabilidad de emitir la primera observacion
  for (let state = 0; state < numberOfStates; state++) {
    forwardMatrix[0][state] =
      initialProbabilities[state] * emissionMatrix[state][firstObservation];
  }

  // recorremos el resto de las observaciones
  // arranca en 1 porque la posicion 0 ya se calculo
  for (let t = 1; t < sequenceLength; t++) {
    const currentObservation = observationIndexes[t];

    // calculamos la probabilidad para cada estado actual
    for (let currentState = 0; currentState < numberOfStates; currentState++) {
      let probabilitySum = 0;

      // recorremos todos los estados anteriores posibles
      for (
        let previousState = 0;
        previousState < numberOfStates;
        previousState++
      ) {
        // prob acumulada anterior x por la prob de transicion
        probabilitySum +=
          forwardMatrix[t - 1][previousState] *
          transitionMatrix[previousState][currentState];
      }

      // multiplicamos la suma de las transiciones x la prob de emitir la observacion actual
      forwardMatrix[t][currentState] =
        probabilitySum * emissionMatrix[currentState][currentObservation];
    }
  }

  // sumamos todos los valores de la ultima fila
  const probability = forwardMatrix[sequenceLength - 1].reduce(
    (sum, value) => sum + value,
    0
  );

  // devolvemos la probabilidad final y la matriz completa
  return {
    probability,
    forwardMatrix,
  };
}
