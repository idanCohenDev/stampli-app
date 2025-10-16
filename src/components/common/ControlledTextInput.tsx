import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface ControlledTextInputProps<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: any;
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
            placeholderTextColor="#A0AEC0"
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
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2D3748',
  },
  inputError: {
    borderColor: '#FC8181',
  },
  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginTop: 4,
  },
});
