import { Chip, Divider } from '@mui/material';

type SectionDividerProps = {
  label: string;
};

export default function SectionDivider({ label }: SectionDividerProps) {
  return (
    <Divider
      sx={{
        width: '100%',
        '&::before, &::after': {
          borderColor: 'white',
        },
      }}
    >
      <Chip label={label} size="medium" color="primary" />
    </Divider>
  );
}
