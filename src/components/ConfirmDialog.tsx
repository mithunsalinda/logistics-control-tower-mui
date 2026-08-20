import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

interface ConfirmDialogProps {
  cancelLabel?: string;
  confirmLabel?: string;
  description: string;
  open: boolean;
  title: string;
  tone?: 'default' | 'warning' | 'danger';
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  description,
  open,
  title,
  tone = 'default',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const color = getToneColor(tone);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '10px',
          border: '1px solid #d9e3ed',
          boxShadow: '0 24px 60px rgba(15, 35, 55, 0.22)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 0.8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: color,
              flexShrink: 0,
            }}
          />
          <Typography sx={{ color: '#10243a', fontSize: 18, fontWeight: 900 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 0.8 }}>
        <Typography sx={{ color: '#52677f', fontSize: 13, lineHeight: 1.55 }}>
          {description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.3, gap: 1 }}>
        <Button variant="outlined" onClick={onCancel} sx={{ borderRadius: '8px', fontWeight: 800 }}>
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            borderRadius: '8px',
            fontWeight: 900,
            backgroundColor: color,
            '&:hover': { backgroundColor: color },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function getToneColor(tone: ConfirmDialogProps['tone']) {
  switch (tone) {
    case 'danger':
      return '#d74d4d';
    case 'warning':
      return '#d66b29';
    default:
      return '#159d95';
  }
}
