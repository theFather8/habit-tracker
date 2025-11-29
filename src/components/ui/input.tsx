import * as React from 'react';
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import {useController} from 'react-hook-form';
import type {TextInputProps} from 'react-native';
import {I18nManager, StyleSheet, View, TextInput} from 'react-native';

import colors from './colors';
import {Text} from './text';

export interface NInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  error?: string;
}

type TRule<T extends FieldValues> =
  | Omit<
      RegisterOptions<T>,
      'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
    >
  | undefined;

export type RuleType<T extends FieldValues> = {[name in keyof T]: TRule<T>};
export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RuleType<T>;
};

interface ControlledInputProps<T extends FieldValues>
  extends NInputProps,
    InputControllerType<T> {}

export const Input = React.forwardRef<TextInput, NInputProps>((props, ref) => {
  const {label, error, testID, ...inputProps} = props;
  const [isFocussed, setIsFocussed] = React.useState(false);
  const onBlur = React.useCallback(() => setIsFocussed(false), []);
  const onFocus = React.useCallback(() => setIsFocussed(true), []);

  const labelClassName = error
    ? 'text-danger-600 dark:text-danger-600 mb-1 text-lg'
    : 'text-gray-300 mb-1 text-lg';
  const inputClassName = `mt-0 rounded-xl border-[0.5px] ${
    error
      ? 'border-danger-600'
      : isFocussed
        ? 'border-purple-500'
        : 'border-gray-700'
  } ${
    props.disabled ? 'bg-neutral-200' : 'bg-gray-900'
  } px-4 py-3 font-inter text-base font-medium leading-5 text-white`;

  return (
    <View style={{marginBottom: 8}}>
      {label ? (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          className={labelClassName}>
          {label}
        </Text>
      ) : null}
      <TextInput
        testID={testID}
        ref={ref}
        placeholderTextColor={colors.neutral[500]}
        className={inputClassName}
        onBlur={onBlur}
        onFocus={onFocus}
        {...inputProps}
        style={StyleSheet.flatten([
          {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'},
          {textAlign: I18nManager.isRTL ? 'right' : 'left'},
          inputProps.style,
        ])}
      />
      {error ? (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          className="text-sm text-danger-400 dark:text-danger-600">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

// only used with react-hook-form
export function ControlledInput<T extends FieldValues>(
  props: ControlledInputProps<T>,
) {
  const {name, control, rules, ...inputProps} = props;

  const {field, fieldState} = useController({control, name, rules});
  return (
    <Input
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={field.onChange}
      value={(field.value as string) || ''}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}
