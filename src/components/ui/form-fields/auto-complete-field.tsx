import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../combobox'
import { Field, FieldDescription, FieldError, FieldLabel } from '../field'
import { AsteriskIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type AutoCompleteFieldProps<F extends FieldValues> = {
  label?: string
  options: Readonly<
    {
      label: string
      value: string | number
    }[]
  >
  control: Control<F>
  name: FieldPath<F>
  placeholder?: string
  description?: string
  required?: boolean
  emptyPlaceholder?: string
}

export function AutoCompleteField<T extends FieldValues>({
  options,
  control,
  name,
  label,
  placeholder,
  required = true,
  description,
  emptyPlaceholder,
}: Readonly<AutoCompleteFieldProps<T>>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && (
              <AsteriskIcon
                className={cn('text-destructive inline size-2.5 align-top')}
              />
            )}
          </FieldLabel>
          <Combobox
            items={options}
            //TODO: fix changing from uncontrolled to controlled component
            // value={field.value}
            onValueChange={(val) => {
              field.onChange(val)
            }}
          >
            <ComboboxInput
              //TODO: fix changing from uncontrolled to controlled component
              // {...field}
              id={field.name}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
            />
            <ComboboxContent>
              <ComboboxEmpty>{emptyPlaceholder}</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    key={item.value}
                    value={item.value}
                    // onSelect={() => {
                    //   console.log("Selected Value", item)
                    //   field.onChange(item.value)
                    // }}
                  >
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

{
  /* <Field>
              <FieldLabel htmlFor="small-form-framework">Framework</FieldLabel>
              <Combobox
                items={[
                  'flutter',
                  'Nextjs',
                  'React',
                  'Vue',
                  'Python',
                  'Kotlin',
                ]}
              >
                <ComboboxInput
                  id="small-form-framework"
                  placeholder="Select a framework"
                  required
                />
                <ComboboxContent>
                  <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field> */
}
