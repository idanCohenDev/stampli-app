import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { theme } from '@/src/theme';

interface ControlledTextInputProps<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T>;
  error?: string;
}

export function ControlledTextInput<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  error,
  style,
  ...textInputProps
}: ControlledTextInputProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, error && styles.inputError, style]}
            value={value as string}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={theme.colors.gray[400]}
            {...textInputProps}
          />
        )}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[1],
  },
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  },
  input: {
    backgroundColor: theme.colors.gray[50],
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing[3],
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  inputError: {
    borderColor: theme.colors.error[500],
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[700],
    marginTop: theme.spacing[1],
  },
});
