import { createFileRoute, Link } from "@tanstack/react-router";
import { isEmail, useForm } from "@mantine/form";
import { Anchor, Container, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import resetPassword from "@/supabase/resetPassword";
import Subtitle from "@/components/misc/Subtitle";
import FormWithDisable from "@/components/misc/FormWithDisable";

export const Route = createFileRoute("/(auth)/resetPassword")({
  component: ResetPassword,
});

function ResetPassword() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail("Invalid email format"),
    },
    validateInputOnBlur: true,
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const { email } = values;
      await resetPassword(email);

      notifications.show({
        withCloseButton: true,
        color: "green",
        title: "Reset email sent!",
        message: "You can close this window and check your email.",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.warn("Error resetting password: ", error.message);
      } else {
        console.warn("Unkown error resetting password: ", JSON.stringify(error));
      }

      notifications.show({
        withCloseButton: true,
        color: "red",
        title: "Error resetting password",
        message: `${(error as Error)?.message || JSON.stringify(error)}`,
      });
    }
  };

  return (
    <Container size={460} my={50}>
      <Title ta="center" my={5}>
        Reset your password
      </Title>
      <Anchor component={Link} to="/">
        <Subtitle>Go back to the login page</Subtitle>
      </Anchor>

      <FormWithDisable
        margins={{ mt: 50 }}
        submitButtonLabels={{
          label: "Email reset link",
          disabledLabel: "Emailing reset link...",
        }}
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <TextInput
          label="Email"
          name="email"
          type="email"
          required
          autoComplete={"email"}
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
      </FormWithDisable>
    </Container>
  );
}
