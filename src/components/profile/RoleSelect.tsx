import { Select, Stack, Text } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { rolesOptions } from "@/tanstack-query/queries/roles";
import Subtitle from "../misc/Subtitle";

interface RoleSelectProps<T extends Record<string, any>> {
  form: UseFormReturnType<T>;
}

export default function RoleSelect<T extends Record<string, any>>({ form }: RoleSelectProps<T>) {
  const { data: rolesInfo, error: rolesError } = useSuspenseQuery(rolesOptions());
  const roleExplanations = rolesInfo.reduce((explanations, row) => {
    explanations[row.name] = row.explanation
    return explanations
  }, {} as { [role: string]: string })

  const [explanation, setExplanation] = useState(roleExplanations["employee"]);

  const errors = [rolesError].filter((error) => !!error)
  if (errors.length > 0) {
    return (
      <Stack>
        <Text>Errors fetching role info</Text>
        {errors.map((error, index) => <Text key={index}>{error.message}</Text>)}
      </Stack>
    );
  }

  const selectData = rolesInfo.map((row) => ({
    label: row.label,
    value: row.name
  }));

  form.watch("role", ({ value }) => setExplanation(roleExplanations[value]));
  
  return (
    <Stack>
      <Select
        label="Dashboard Role"
        name="role"
        data={selectData}
        key={form.key("role")}
        { ...form.getInputProps("role") }
        
      />
      <Subtitle textAlign="start">{explanation}</Subtitle>
    </Stack>
  );
}