import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";

type CustomButtonVariant = "primary" | "secondary" | "outlined";

interface CustomButtonProps extends Omit<ButtonProps, "variant"> {
  customVariant?: CustomButtonVariant;
}

const CustomButton = ({
  customVariant = "primary",
  children,
  sx,
  size = "small",
  ...props
}: CustomButtonProps) => {
  const variantStyles = {
    primary: {
      backgroundColor: "#1976d2",
      color: "#ffffff",
      border: "1px solid #1976d2",

      "&:hover": {
        backgroundColor: "#115293",
        borderColor: "#115293",
      },
    },

    secondary: {
      backgroundColor: "#ed6c02",
      color: "#ffffff",
      border: "1px solid #ed6c02",

      "&:hover": {
        backgroundColor: "#c45600",
        borderColor: "#c45600",
      },
    },

    outlined: {
      backgroundColor: "transparent",
      color: "#1976d2",
      border: "1px solid #1976d2",

      "&:hover": {
        backgroundColor: "rgba(25, 118, 210, 0.08)",
        borderColor: "#115293",
      },
    },
  };

  return (
    <Button
      {...props}
      sx={{
        minWidth: "120px",
        padding: "10px 20px",
        borderRadius: "8px",
        textTransform: "none",
        fontWeight: 600,
        ...variantStyles[customVariant],
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
