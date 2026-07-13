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
} from '@mui/material';

type ProbabilityMatrixProps = {
  rowNames: string[];
  columnNames: string[];
  matrix: number[][];
  onChange: (matrix: number[][]) => void;
};

export default function ProbabilityMatrix({
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

    updatedMatrix[rowIndex][columnIndex] = newValue;

    onChange(updatedMatrix);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <TableContainer
        sx={{
          overflowX: 'auto',
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

                          handleCellChange(
                            rowIndex,
                            columnIndex,
                            Math.min(Math.max(value, 0), 1)
                          );
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
    </Box>
  );
}
