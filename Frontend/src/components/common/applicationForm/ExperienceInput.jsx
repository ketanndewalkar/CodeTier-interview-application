import React from 'react';
import FormInput from './FormInput';

export default function ExperienceInput({ value, onChange, error, required = true }) {
  return (
    <FormInput
      label="Years of Experience"
      name="yearsOfExperience"
      type="number"
      value={value}
      onChange={onChange}
      placeholder="2"
      required={required}
      error={error}
      min={0}
      step="0.5"
      helperText="Total relevant years of work experience"
    />
  );
}
