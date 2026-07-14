import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
} from '@mui/material';

type ProbabilityMatrixProps = {
  description?: string;
  rowNames: string[];
  columnNames: string[];
  matrix: number[][];
  onChange: (matrix: number[][]) => void;
};

export default function ProbabilityMatrix({
  description,
  rowNames,
  columnNames,
  matrix,
  onChange,
}: ProbabilityMatrixProps) {
  const handleCellChange = (
    rowIndex: number,
    columnIndex: number,
    newValue: number
  ) => {
    const updatedMatrix = matrix.map((row) => [...row]);

    const roundedValue = Number(newValue.toFixed(2));

    updatedMatrix[rowIndex][columnIndex] = roundedValue;

    onChange(updatedMatrix);
  };

  const distributeEqually = () => {
    const totalUnits = 100;
    const baseUnits = Math.floor(totalUnits / columnNames.length);
    const remainder = totalUnits % columnNames.length;

    const row = Array.from({ length: columnNames.length }, (_, index) => {
      const units = baseUnits + (index < remainder ? 1 : 0);

      return units / 100;
    });

    const newMatrix = Array.from({ length: rowNames.length }, () => [...row]);

    onChange(newMatrix);
  };

  const rowSums = matrix.map((row) =>
    row.reduce((total, probability) => total + probability, 0)
  );

  const allRowsValid = rowSums.every((rowSum) => Math.abs(rowSum - 1) < 0.001);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="subtitle1"
        sx={{
          color: 'gray',
          mt: 1,
          mb: 1,
        }}
      >
        {description}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 2,
          color: allRowsValid ? 'success.main' : 'warning.main',
        }}
      >
        {allRowsValid
          ? 'Todas las filas suman 1.00 correctamente.'
          : 'Cada fila debe sumar exactamente 1.00.'}
      </Typography>

      <TableContainer
        sx={{
          mt: 2,
          border: '1px solid',
          borderColor: 'grey.800',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: 500,
            color: 'white',
            '& .MuiTableCell-root': {
              borderColor: 'gray',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell />

              {columnNames.map((columnName, columnIndex) => (
                <TableCell
                  key={columnIndex}
                  align="center"
                  sx={{
                    color: 'white',
                  }}
                >
                  {columnName}
                </TableCell>
              ))}

              <TableCell
                align="center"
                sx={{
                  color: 'white',
                }}
              >
                SUM
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rowNames.map((rowName, rowIndex) => {
              const rowSum =
                matrix[rowIndex]?.reduce(
                  (total, probability) => total + probability,
                  0
                ) ?? 0;

              const isValid = Math.abs(rowSum - 1) < 0.001;

              return (
                <TableRow key={rowIndex}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      whiteSpace: 'nowrap',
                      color: 'white',
                    }}
                  >
                    {rowName}
                  </TableCell>

                  {columnNames.map((_, columnIndex) => (
                    <TableCell key={columnIndex} align="center">
                      <TextField
                        type="number"
                        variant="standard"
                        value={matrix[rowIndex]?.[columnIndex] ?? 0}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          const limitedValue = Math.min(Math.max(value, 0), 1);

                          handleCellChange(rowIndex, columnIndex, limitedValue);
                        }}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            max: 1,
                            step: 0.01,
                          },
                        }}
                        sx={{
                          width: 90,

                          '& input': {
                            color: 'white',
                            textAlign: 'center',
                          },

                          '& .MuiInput-underline:before': {
                            borderBottom: 'none',
                          },

                          '& .MuiInput-underline:after': {
                            borderBottom: 'none',
                          },

                          '& .MuiInput-underline:hover:not(.Mui-disabled):before':
                            {
                              borderBottom: 'none',
                            },
                        }}
                      />
                    </TableCell>
                  ))}

                  <TableCell align="center">
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        color: isValid ? 'success.main' : 'error.main',
                      }}
                    >
                      {rowSum.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="outlined"
        onClick={distributeEqually}
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
