import { Alert, Button, Group, Modal, Text, Title } from "@mantine/core";

interface NavigationBlockAlertProps {
  opened: boolean;
  proceed: (() => void) | undefined;
  reset: (() => void) | undefined;
  text: {
    title: string;
    message: string;
  };
}

export default function NavigationBlockAlert({
  opened,
  proceed,
  reset,
  text,
}: NavigationBlockAlertProps) {
  return (
    <Modal.Root
      opened={opened}
      onClose={() => {}}
      closeOnClickOutside={false}
      closeOnEscape={false}
      zIndex={300}
    >
      <Modal.Overlay />
      <Modal.Content p={0}>
        <Modal.Body p={0}>
          <Alert
            title={<Title order={2}>{text.title}</Title>}
            withCloseButton
            onClose={reset}
          >
            <Text mb={'md'}>{text.message}</Text>
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
