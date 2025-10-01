import { Button, Center, Paper } from "@mantine/core";
import { useRouterState } from "@tanstack/react-router";
import { useRef, type FormEvent } from "react";

interface FormWithDisableProps {
  margins?: Record<string, number>;
  submitButtonLabels: { label: string; submittingLabel: string };
  submitButtonStyle?: Record<string, string | boolean>;
  submitButtonPlacement?: "top" | "bottom";
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | void;
  // formIsValid: boolean;
  formIsValid: () => boolean;
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
  formIsValid,
  children,
}: FormWithDisableProps) {
  const isLoading = useRouterState({ select: (state) => state.isLoading });
  const isSubmittingRef = useRef(false);
  const isDisabled = isSubmittingRef.current || isLoading || !formIsValid();

  console.log('isLoading', isLoading);
  console.log('isSubmittingRef.current', isSubmittingRef.current);
  console.log('formIsValid', formIsValid());

  const { label, submittingLabel } = submitButtonLabels;

  const SubmitButton = () => (
    <Center>
      <Button disabled={isDisabled} type="submit" {...submitButtonStyle}>
        {isSubmittingRef.current ? submittingLabel : label}
      </Button>
    </Center>
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    isSubmittingRef.current = true;

    try {
      await onSubmit(e);
    } catch (error) {
      console.warn("Error submitting form");

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
        {submitButtonPlacement === "top" && <SubmitButton />}
        {children}
        {submitButtonPlacement === "bottom" && <SubmitButton />}
      </form>
    </Paper>
  );
}
