import { Button, Center, Paper } from "@mantine/core";
import { useRouterState } from "@tanstack/react-router";
import { useRef, type FormEvent } from "react";

interface FormWithDisableProps {
  margins?: Record<string, number>;
  submitButtonLabels: { label: string, disabledLabel: string };
  submitButtonStyle?: Record<string, any>;
  submitButtonPlacement?: "top" | "bottom"
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | void;
  children: React.ReactNode;
}

export default function FormWithDisable({
  margins,
  submitButtonLabels,
  submitButtonStyle = {
    fullWidth: true,
    mt: "xl",
  },
  submitButtonPlacement = "bottom",
  onSubmit,
  children,
}: FormWithDisableProps) {
  const isLoading = useRouterState({ select: (state) => state.isLoading });
  const isSubmittingRef = useRef(false);
  const isDisabled = isSubmittingRef.current || isLoading;

  const { label, disabledLabel } = submitButtonLabels;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    isSubmittingRef.current = true;

    try {
      await onSubmit(e);
    } catch(error) {
      console.warn("Error submitting form")

      if (error instanceof Error) {
        console.warn(error.message);
      } else {
        console.warn(JSON.stringify(error));
      }

      throw error;
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <Paper {...margins} pos={"relative"}>
      <form onSubmit={handleSubmit}>
        <fieldset
          disabled={isDisabled}
          style={{ all: "unset", display: "contents" }}
        >
          {submitButtonPlacement === "top" && (
            <Center>
              <Button type="submit" {...submitButtonStyle}>
                {isDisabled ? disabledLabel : label}
              </Button>
            </Center>
          )}
          {children}
          {submitButtonPlacement === "bottom" && (
            <Center>
              <Button type="submit" {...submitButtonStyle}>
                {isDisabled ? disabledLabel : label}
              </Button>
            </Center>
          )}
        </fieldset>
      </form>
    </Paper>
  );
}