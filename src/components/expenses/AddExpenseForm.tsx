import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NewExpense, ExpenseCategory } from '@/src/types';
import { getAllCategories, getCategoryColor } from '@/src/utils';
import { ControlledTextInput } from '../common';

interface AddExpenseFormProps {
  onSubmit: (expense: NewExpense) => void;
  isLoading?: boolean;
}

interface FormData {
  merchant: string;
  amount: string;
  category: ExpenseCategory;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onSubmit, isLoading = false }) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      merchant: '',
      amount: '',
      category: ExpenseCategory.OTHER,
    },
  });

  const onFormSubmit = (data: FormData) => {
    const numericAmount = parseFloat(data.amount);

    onSubmit({
      merchant: data.merchant.trim(),
      amount: numericAmount,
      category: data.category,
    });

    reset();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Expense</Text>

      <View style={styles.form}>
        <ControlledTextInput
          control={control}
          name="merchant"
          label="Merchant"
          placeholder="e.g., Starbucks"
          rules={{
            required: 'Merchant is required',
            minLength: { value: 2, message: 'Merchant name too short' },
          }}
          error={errors.merchant?.message}
        />

        <ControlledTextInput
          control={control}
          name="amount"
          label="Amount"
          placeholder="0.00"
          keyboardType="decimal-pad"
          rules={{
            required: 'Amount is required',
            validate: (value: string) => {
              const num = parseFloat(value);
              if (isNaN(num)) return 'Invalid amount';
              if (num <= 0) return 'Amount must be greater than 0';
              return true;
            },
          }}
          error={errors.amount?.message}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  style={styles.categoryButton}
                  onPress={() => setShowCategoryModal(true)}
                >
                  <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(value) }]} />
                  <Text style={styles.categoryButtonText}>{value}</Text>
                </TouchableOpacity>

                <Modal
                  visible={showCategoryModal}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setShowCategoryModal(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Select Category</Text>
                      <ScrollView style={styles.categoryList}>
                        {getAllCategories().map((cat) => (
                          <TouchableOpacity
                            key={cat}
                            style={styles.categoryOption}
                            onPress={() => {
                              onChange(cat);
                              setShowCategoryModal(false);
                            }}
                          >
                            <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(cat) }]} />
                            <Text style={styles.categoryOptionText}>{cat}</Text>
                            {value === cat && <Text style={styles.checkmark}>✓</Text>}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowCategoryModal(false)}
                      >
                        <Text style={styles.closeButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </>
            )}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit(onFormSubmit)}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Adding...' : 'Add Expense'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
  },
  categoryIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#2D3748',
  },
  submitButton: {
    backgroundColor: '#4299E1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  categoryList: {
    marginBottom: 16,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#2D3748',
    flex: 1,
  },
  checkmark: {
    fontSize: 20,
    color: '#4299E1',
  },
  closeButton: {
    backgroundColor: '#E2E8F0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
  },
});
