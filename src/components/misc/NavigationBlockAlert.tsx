import { Alert, Button, Group, Modal, Text, Title } from "@mantine/core";

interface NavigationBlockAlertProps {
  blockerProps: {
    status: "blocked" | "idle";
    proceed: (() => void) | undefined;
    reset: (() => void) | undefined;
  }
  alertText: {
    title: string;
    message: string;
  };
}

export default function NavigationBlockAlert({
  blockerProps,
  alertText,
}: NavigationBlockAlertProps) {
  const { status, proceed, reset } = blockerProps;
  const { title, message } = alertText;

  return (
    <Modal.Root
      opened={status === "blocked"}
      onClose={() => {}}
      closeOnClickOutside={false}
      closeOnEscape={false}
      zIndex={300}
    >
      <Modal.Overlay />
      <Modal.Content p={0}>
        <Modal.Body p={0}>
          <Alert
            title={<Title order={2}>{title}</Title>}
            withCloseButton
            onClose={reset}
          >
            <Text mb={'md'}>{message}</Text>
            <Group justify="center">
              <Button variant="outline" onClick={reset}>Go Back</Button>
              <Button onClick={proceed}>Proceed</Button>
            </Group>
          </Alert>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}