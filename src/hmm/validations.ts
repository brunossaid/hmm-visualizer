const EPSILON = 0.000001;

type ValidateHmmModelParams = {
  stateNames: string[];
  observationNames: string[];
  initialProbabilities: number[];
  transitionMatrix: number[][];
  emissionMatrix: number[][];
  observationSequenceLength: number;
};

export type HmmValidationResult = {
  isValid: boolean;
  errors: string[];
};

const isApproximatelyEqual = (value: number, expected: number) => {
  return Math.abs(value - expected) < EPSILON;
};

const hasValidNames = (names: string[]) => {
  return names.every((name) => name.trim().length > 0);
};

const hasUniqueNames = (names: string[]) => {
  const normalizedNames = names.map((name) => name.trim().toLowerCase());

  return new Set(normalizedNames).size === normalizedNames.length;
};

const isValidProbability = (value: number) => {
  return Number.isFinite(value) && value >= 0 && value <= 1;
};

const isValidProbabilityMatrix = (
  matrix: number[][],
  expectedRows: number,
  expectedColumns: number
) => {
  if (matrix.length !== expectedRows) {
    return false;
  }

  return matrix.every((row) => {
    if (row.length !== expectedColumns) {
      return false;
    }

    const hasValidValues = row.every(isValidProbability);

    const rowTotal = row.reduce((total, probability) => total + probability, 0);

    return hasValidValues && isApproximatelyEqual(rowTotal, 1);
  });
};

export function validateHmmModel({
  stateNames,
  observationNames,
  initialProbabilities,
  transitionMatrix,
  emissionMatrix,
  observationSequenceLength,
}: ValidateHmmModelParams): HmmValidationResult {
  const errors: string[] = [];

  if (!hasValidNames(stateNames)) {
    errors.push('Todos los estados deben tener un nombre');
  }

  if (!hasUniqueNames(stateNames)) {
    errors.push('Los nombres de los estados no pueden repetirse');
  }

  if (!hasValidNames(observationNames)) {
    errors.push('Todas las observaciones deben tener un nombre');
  }

  if (!hasUniqueNames(observationNames)) {
    errors.push('Los nombres de las observaciones no pueden repetirse');
  }

  const hasValidInitialProbabilityValues =
    initialProbabilities.length === stateNames.length &&
    initialProbabilities.every(
      (probability) =>
        Number.isFinite(probability) && probability >= 0 && probability <= 100
    );

  const totalInitialProbability = initialProbabilities.reduce(
    (total, probability) => total + probability,
    0
  );

  if (
    !hasValidInitialProbabilityValues ||
    !isApproximatelyEqual(totalInitialProbability, 100)
  ) {
    errors.push('Las probabilidades iniciales deben sumar 100%');
  }

  const hasValidTransitionMatrix = isValidProbabilityMatrix(
    transitionMatrix,
    stateNames.length,
    stateNames.length
  );

  if (!hasValidTransitionMatrix) {
    errors.push('La matriz de transición contiene filas inválidas');
  }

  const hasValidEmissionMatrix = isValidProbabilityMatrix(
    emissionMatrix,
    stateNames.length,
    observationNames.length
  );

  if (!hasValidEmissionMatrix) {
    errors.push('La matriz de emisión contiene filas inválidas');
  }

  if (observationSequenceLength === 0) {
    errors.push('Debe agregar al menos una observación a la secuencia');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
