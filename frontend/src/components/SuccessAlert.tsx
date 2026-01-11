import { Alert, Snackbar } from "@mui/material";

interface SuccessAlertProps {
  message: string | null;
  onClose: () => void;
}

export function SuccessAlert({ message, onClose }: SuccessAlertProps) {
  return (
    <Snackbar
      open={!!message}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
