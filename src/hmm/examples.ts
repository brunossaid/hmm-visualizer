export type HmmExample = {
  numStates: number;
  stateNames: string[];
  initialProbabilities: number[];
  numObservations: number;
  observationNames: string[];
  transitionMatrix: number[][];
  emissionMatrix: number[][];
  observationSequence: number[];
};

export const diceExample: HmmExample = {
  numStates: 2,
  stateNames: ['Normal', 'Cargado'],
  initialProbabilities: [50, 50],
  numObservations: 6,
  observationNames: ['1', '2', '3', '4', '5', '6'],
  transitionMatrix: [
    [0.95, 0.05],
    [0.05, 0.95],
  ],
  emissionMatrix: [
    [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
    [0.1, 0.1, 0.1, 0.1, 0.1, 0.5],
  ],
  observationSequence: [5, 0], // 6, 1
};

export const weatherExample: HmmExample = {
  numStates: 2,
  stateNames: ['Soleado', 'Lluvioso'],
  initialProbabilities: [60, 40],
  numObservations: 3,
  observationNames: ['Caminar', 'Comprar', 'Limpiar'],
  transitionMatrix: [
    [0.7, 0.3],
    [0.4, 0.6],
  ],
  emissionMatrix: [
    [0.6, 0.3, 0.1],
    [0.1, 0.4, 0.5],
  ],
  observationSequence: [0, 1, 2],
};

export const coinExample: HmmExample = {
  numStates: 2,
  stateNames: ['Justa', 'Cargada'],
  initialProbabilities: [50, 50],
  numObservations: 2,
  observationNames: ['Cara', 'Cruz'],
  transitionMatrix: [
    [0.8, 0.2],
    [0.3, 0.7],
  ],
  emissionMatrix: [
    [0.5, 0.5],
    [0.8, 0.2],
  ],
  observationSequence: [0, 0, 1, 0],
};
