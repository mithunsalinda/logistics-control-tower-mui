import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

type InputBoxVariant = "primary" | "secondary" | "outlined";

type InputBoxProps = TextFieldProps & {
  inputVariant?: InputBoxVariant;
};

const InputBox = ({
  inputVariant = "outlined",
  sx,
  ...props
}: InputBoxProps) => {
  const variantStyles = {
    primary: {
      backgroundColor: "#f2f7ff",

      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#1976d2",
        },

        "&:hover fieldset": {
          borderColor: "#115293",
        },

        "&.Mui-focused fieldset": {
          borderColor: "#1976d2",
          borderWidth: "2px",
        },
      },
    },

    secondary: {
      backgroundColor: "#fff7ed",

      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#ed6c02",
        },

        "&:hover fieldset": {
          borderColor: "#c45600",
        },

        "&.Mui-focused fieldset": {
          borderColor: "#ed6c02",
          borderWidth: "2px",
        },
      },
    },

    outlined: {
      backgroundColor: "transparent",

      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#9e9e9e",
        },

        "&:hover fieldset": {
          borderColor: "#1976d2",
        },

        "&.Mui-focused fieldset": {
          borderColor: "#1976d2",
          borderWidth: "2px",
        },
      },
    },
  };

  return (
    <TextField
      {...props}
      variant="outlined"
      fullWidth
      size="small"
      sx={[
        {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
        variantStyles[inputVariant],
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
};

export default InputBox;
