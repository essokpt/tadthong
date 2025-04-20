'use client';

import { useEffect, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { UseFormReturn } from 'react-hook-form';
import { formatCurrency } from '@/lib/utils';

type MoneyInputProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  value?: string | number;
};

export const MoneyInput = (props: MoneyInputProps) => {
  const [inputValue, setInputValue] = useState<string>(props.value ? formatCurrency(Number(props.value)) : '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const formValue = props.form.getValues(props.name);
      if (formValue && formValue !== inputValue) {
        setInputValue(formatCurrency(Number(formValue)));
      }
    }, 900);
    return () => clearTimeout(timeoutId);

   
  }, [props.form, props.name, props.value, inputValue]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const rawValue = e.target.value.replace(/\D/g, '');
  //    const numericValue = (Number(rawValue) / 100).toFixed(2);
  
  //    console.log('rawValue', rawValue);
  //    setInputValue(rawValue);
  //    props.form.setValue(props.name, numericValue, { shouldValidate: false });
  // };

  const handleBlur = () => {
    if (inputValue) {
      const formattedValue = formatCurrency(Number(inputValue) / 100);
      setInputValue(formattedValue);
    }
  };

  const handleFocus = () => {
    const currentValue = props.form.getValues(props.name);
    if (currentValue) {
      setInputValue((Number(currentValue) * 100).toString());
    }
  };

  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Input
              placeholder={props.placeholder}
              type="text"
              value={inputValue}
              //onChange={handleChange}
              onChange={(ev) => {
                const inputValue = ev.target.value;
                setInputValue(inputValue);
                const numericValue =
                  Number(inputValue.replace(/\D/g, "")) / 100;
                field.onChange(numericValue || 0);
              }}
              onBlur={handleBlur}
              onFocus={handleFocus}
              name={field.name}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};