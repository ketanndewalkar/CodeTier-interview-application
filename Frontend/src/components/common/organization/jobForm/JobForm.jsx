import React, { useState } from 'react';
import FormInput from './FormInput';
import FormTextarea from './FormTextarea';
import SkillSelector from './SkillSelector';
import ExperienceSelector from './ExperienceSelector';
import DatePicker from './DatePicker';
import InterviewConfiguration from './InterviewConfiguration';
import StatusSelector from './StatusSelector';
import FormActions from './FormActions';
import toast from 'react-hot-toast';

export default function JobForm({ onSubmit, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    requiredSkills: initialData.requiredSkills || [],
    experience: initialData.experience || 'MID_LEVEL',
    applicationStartDate: initialData.applicationStartDate || new Date().toISOString().split('T')[0],
    applicationDeadline: initialData.applicationDeadline || '',
    interviewConfig: {
      duration: initialData.interviewConfig?.duration || '60 minutes',
      bufferTime: initialData.interviewConfig?.bufferTime || '10 minutes',
      environmentId: initialData.interviewConfig?.environmentId || ''
    },
    availabilityType: initialData.availabilityType || 'FULL_TIME',
    compensation: {
      amount: initialData.compensation?.amount || '',
      type: initialData.compensation?.type || 'SALARY',
      currency: initialData.compensation?.currency || 'INR',
      period: initialData.compensation?.period || 'MONTHLY',
    },
    status: initialData.status || 'DRAFT'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'Job title must be at least 3 characters long.';
    }

    if (!formData.description || formData.description.trim().length < 20) {
      newErrors.description = 'Job description must be at least 20 characters long.';
    }

    if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
      newErrors.requiredSkills = 'At least one required skill must be added.';
    }

    if (!formData.experience) {
      newErrors.experience = 'Experience level selection is required.';
    }

    if (!formData.applicationStartDate) {
      newErrors.applicationStartDate = 'Application start date is required.';
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = 'Application deadline date is required.';
    } else if (
      formData.applicationStartDate &&
      new Date(formData.applicationStartDate) > new Date(formData.applicationDeadline)
    ) {
      newErrors.applicationDeadline = 'Application deadline cannot be earlier than start date.';
    }

    const interviewErrors = {};
    if (!formData.interviewConfig.duration) {
      interviewErrors.duration = 'Interview duration is required.';
    }
    if (!formData.interviewConfig.bufferTime) {
      interviewErrors.bufferTime = 'Buffer time is required.';
    }
    if (!formData.interviewConfig.environmentId) {
      interviewErrors.environmentId = 'Please select an interview coding environment.';
    }

    if (Object.keys(interviewErrors).length > 0) {
      newErrors.interviewConfig = interviewErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!validate()) {
    //   toast.error('Please resolve validation errors before submitting.');
    //   return;
    // }

    setIsSubmitting(true);

    // Exact Job Opening Document as required by Schema
    const jobOpeningDocument = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      requiredSkills: formData.requiredSkills,
      experience: formData.experience,
      applicationStartDate: formData.applicationStartDate,
      applicationDeadline: formData.applicationDeadline,
      interviewConfig: {
        duration: formData.interviewConfig.duration,
        bufferTime: formData.interviewConfig.bufferTime,
        environmentId: formData.interviewConfig.environmentId
      },
      availabilityType: formData.availabilityType,
      compensation: {
        amount: formData.compensation.amount ? Number(formData.compensation.amount) : null,
        type: formData.compensation.type,
        currency: formData.compensation.currency,
        period: formData.compensation.period
      },
      status: formData.status
    };

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSubmit) {
        onSubmit(jobOpeningDocument);
      }
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* Section 1: Job Information */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#c084fc] pb-1 border-b border-white/5">
          Section 1: Job Information
        </h3>

        <FormInput
          label="Job Title"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter job title (e.g. Full Stack Developer)"
          error={errors.title}
          required
        />

        <FormTextarea
          label="Job Description"
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Seeking a Full Stack Developer proficient in building scalable web applications. Outline responsibilities, expectations, and required background..."
          rows={4}
          error={errors.description}
          required
          helpText="Minimum 20 characters describing candidate responsibilities and role requirements."
        />
      </div>

      {/* Section 2: Required Skills */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#c084fc] pb-1 border-b border-white/5">
          Section 2: Required Skills
        </h3>

        <SkillSelector
          skills={formData.requiredSkills}
          onChange={(skills) => setFormData({ ...formData, requiredSkills: skills })}
          error={errors.requiredSkills}
          required
        />
      </div>

      {/* Section 3: Experience Requirement */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#c084fc] pb-1 border-b border-white/5">
          Section 3: Experience Requirement
        </h3>

        <ExperienceSelector
          value={formData.experience}
          onChange={(exp) => setFormData({ ...formData, experience: exp })}
          error={errors.experience}
          required
        />
      </div>

      {/* Section 4: Application Timeline */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#c084fc] pb-1 border-b border-white/5">
          Section 4: Application Timeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label="Application Opens"
            name="applicationStartDate"
            value={formData.applicationStartDate}
            onChange={(e) => setFormData({ ...formData, applicationStartDate: e.target.value })}
            error={errors.applicationStartDate}
            required
          />

          <DatePicker
            label="Application Deadline"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            min={formData.applicationStartDate}
            onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
            error={errors.applicationDeadline}
            required
          />
        </div>
      </div>

      {/* Section 5: Interview Configuration */}
      <div className="pt-2">
        <InterviewConfiguration
          value={formData.interviewConfig}
          onChange={(config) => setFormData({ ...formData, interviewConfig: config })}
          errors={errors.interviewConfig}
        />
      </div>

      {/* Section 6: Job Type & Compensation */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#c084fc] pb-1 border-b border-white/5">
          Section 6: Job Type & Compensation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 block">
              Job Type / Availability <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.availabilityType}
              onChange={(e) => setFormData({ ...formData, availabilityType: e.target.value })}
              className="w-full h-10 px-3.5 bg-[#181424] border border-white/10 focus:border-[#6C4F91] rounded-xl text-xs text-white focus:outline-none transition-all cursor-pointer font-sans"
            >
              <option value="FULL_TIME">Full-time Job</option>
              <option value="PART_TIME">Part-time Job</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract Basis</option>
              <option value="FREELANCE">Freelance</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 block">
              Compensation Type
            </label>
            <select
              value={formData.compensation.type}
              onChange={(e) => setFormData({
                ...formData,
                compensation: { ...formData.compensation, type: e.target.value }
              })}
              className="w-full h-10 px-3.5 bg-[#181424] border border-white/10 focus:border-[#6C4F91] rounded-xl text-xs text-white focus:outline-none transition-all cursor-pointer font-sans"
            >
              <option value="SALARY">Salary (Job)</option>
              <option value="STIPEND">Stipend (Internship)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 block">
              Compensation Amount (per Month/Year)
            </label>
            <input
              type="number"
              value={formData.compensation.amount}
              onChange={(e) => setFormData({
                ...formData,
                compensation: { ...formData.compensation, amount: e.target.value }
              })}
              placeholder="e.g. 50000"
              className="w-full h-10 px-3.5 bg-[#181424] border border-white/10 focus:border-[#6C4F91] rounded-xl text-xs text-white focus:outline-none transition-all font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 block">
              Pay Period
            </label>
            <select
              value={formData.compensation.period}
              onChange={(e) => setFormData({
                ...formData,
                compensation: { ...formData.compensation, period: e.target.value }
              })}
              className="w-full h-10 px-3.5 bg-[#181424] border border-white/10 focus:border-[#6C4F91] rounded-xl text-xs text-white focus:outline-none transition-all cursor-pointer font-sans"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="ANNUALLY">Annually</option>
              <option value="LUMP_SUM">Lump Sum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 7: Job Status */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#c084fc] pb-1 border-b border-white/5">
          Section 7: Job Status
        </h3>

        <StatusSelector
          value={formData.status}
          onChange={(status) => setFormData({ ...formData, status })}
          error={errors.status}
        />
      </div>

      {/* Bottom Actions */}
      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}
