import { notifications } from "@mantine/notifications";
import { hasLength, matchesField, useForm } from "@mantine/form";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Container, PasswordInput, Title } from "@mantine/core";
import { getSupaSession } from "@/supabase/getSupaSession";
import changePassword from "@/supabase/changePassword";
import Subtitle from "@/components/misc/Subtitle";
import FormWithDisable from "@/components/misc/FormWithDisable";

export const Route = createFileRoute("/(auth)/changePassword")({
  beforeLoad: async () => {
    const session = await getSupaSession();

    if (!session) {
      notifications.show({
        withCloseButton: true,
        color: "red",
        title: "Authentication Required",
        message: "You must be logged in to access this page.",
      });
      
      throw redirect({ to: "/", search: { redirect: "" } });
    }
  },
  component: ChangePassword,
});

function ChangePassword() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: hasLength({ min: 6 }, "Password must be at least 6 characters"),
      confirmPassword: matchesField("password", "Passwords are not the same"),
    },
    validateInputOnBlur: true,
  });

  const navigate = useNavigate();
  const handleSubmit = async (values: typeof form.values) => {
    try {
      const { password } = values;
      await changePassword(password);

      notifications.show({
        withCloseButton: true,
        color: "green",
        title: "Password Changed",
        message: "You have successfully updated your password!",
      });

      await navigate({ to: "/dashboard/home" });
    } catch (error) {
      if (error instanceof Error) {
        console.warn("Error updating password: ", error.message);
      } else {
        console.warn("Unkown error updating password: ", JSON.stringify(error));
      }

      notifications.show({
        withCloseButton: true,
        color: "red",
        title: "Error updating password",
        message: `${(error as Error)?.message || JSON.stringify(error)}`,
      });
    }
  };

  return (
    <Container size={460} my={50}>
      <Title ta="center" my={5}>
        Change your password
      </Title>
      <Subtitle>Enter your new password below</Subtitle>

      <FormWithDisable
        margins={{ mt: 50 }}
        submitButtonLabels={{
          label: "Change Password",
          disabledLabel: "Changing Password...",
        }}
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <PasswordInput
          label="New Password"
          name="password"
          required
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <PasswordInput
          mt="md"
          label="Confirm New Password"
          name="confirmPassword"
          required
          key={form.key("confirmPassword")}
          {...form.getInputProps("confirmPassword")}
        />
      </FormWithDisable>
    </Container>
  );
}
