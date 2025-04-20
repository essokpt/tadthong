import { useEffect, useReducer } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input, InputProps } from "../ui/input";
import { toCurrency } from "@/lib/utils";

export type InputCurrencyProps<T extends FieldValues> = InputProps & {
  name: Path<T>;
  label?: string;
};

// const toCurrency = (value: number) =>
//   new Intl.NumberFormat("th-TH", {
//     currency: "THA",
//     style: "currency",
//     currencyDisplay: "code",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(value)
//   .replace("THA", "")
//   .trim()

function InputCurrency<T extends FieldValues>({
  name,
  label,
  ...props
}: InputCurrencyProps<T>) {
  const { watch, control } = useFormContext();
  const formValue = watch(name);

  const [value, setValue] = useReducer((_: string, next: string) => {
    if (!next) return "";
    const numericValue = Number(next.replace(/\D/g, "")) / 100;
    return numericValue ? toCurrency(numericValue) : "";
  }, "");

  useEffect(() => {
    setValue(formValue ? toCurrency(formValue) : "");
  }, [formValue]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              id={name}
              type="text"
              {...props}
              {...field}
              onChange={(ev) => {
                const inputValue = ev.target.value;
                setValue(inputValue);
                const numericValue =
                  Number(inputValue.replace(/\D/g, "")) / 100;
                field.onChange(numericValue || 0);
              }}
              value={value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default InputCurrency;