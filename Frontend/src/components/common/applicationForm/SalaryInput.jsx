import React from 'react';
import FormInput from './FormInput';

export default function SalaryInput({ value, onChange, error, required = true }) {
  return (
    <FormInput
      label="Expected Salary (Annual)"
      name="expectedSalary"
      type="number"
      value={value}
      onChange={onChange}
      placeholder="200000"
      prefix="₹"
      required={required}
      error={error}
      min={0}
      helperText="Enter your expected total annual CTC in INR"
    />
  );
}
