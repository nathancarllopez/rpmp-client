import { Button, createTheme, Modal, Paper } from "@mantine/core";

export const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        variant: 'default'
      }
    }),
    Modal: Modal.extend({
      defaultProps: {
        withCloseButton: false,
        padding: 0,
        zIndex: 300
      }
    }),
    Paper: Paper.extend({
      defaultProps: {
        shadow: "md",
        radius: "md",
        withBorder: true,
        p: 30,
        mt: 5
      }
    }),
  }
});