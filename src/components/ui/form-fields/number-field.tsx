import { FieldValues } from "react-hook-form";
import { TextField, TextFieldProps } from "./text-field";

type NumberInputProps<F extends FieldValues> = Omit<TextFieldProps<F>, "type">;

export function NumberInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = true,
}: Readonly<NumberInputProps<T>>) {
  return (
    <TextField
      control={control}
      name={name}
      placeholder={placeholder}
      label={label}
      required={required}
      type={"number"}
    />
  );
}