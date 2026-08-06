import React, { useState } from 'react';
import {
  FileText,
  Briefcase,
  MapPin,
  Globe,
  MessageSquare,
  BookOpen,
  ArrowLeft,
  X,
  CheckCircle2,
  Building,
} from 'lucide-react';
import ApplicationFormSection from './ApplicationFormSection';
import ResumeUploader from './ResumeUploader';
import ExperienceInput from './ExperienceInput';
import SalaryInput from './SalaryInput';
import FormInput from './FormInput';
import PortfolioInput from './PortfolioInput';
import FormTextarea from './FormTextarea';
import SubmitActions from './SubmitActions';
import { Toaster } from '../../ui/Toaster';
import { useCreateApplication } from '../../../pages/Candidate/hooks/useCreateApplication';

export default function ApplicationForm({ job, onCancel, onSuccess, isModal = false }) {
  const { apply, isSubmitting } = useCreateApplication({
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    }
  });

  const [formData, setFormData] = useState({
    resumeFile: null,
    yearsOfExperience: '',
    expectedSalary: '',
    noticePeriod: '',
    currentLocation: '',
    portfolioLinks: [
      { platform: 'GITHUB', url: '' },
      { platform: 'LINKEDIN', url: '' },
    ],
    message: '',
    coverLetter: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleResumeSelect = (file, errorMsg) => {
    if (errorMsg) {
      setErrors((prev) => ({ ...prev, resumeFile: errorMsg }));
      setFormData((prev) => ({ ...prev, resumeFile: null }));
    } else {
      setFormData((prev) => ({ ...prev, resumeFile: file }));
      setErrors((prev) => ({ ...prev, resumeFile: null }));
    }
  };

  const handleResumeRemove = () => {
    setFormData((prev) => ({ ...prev, resumeFile: null }));
  };

  const handlePortfolioLinksChange = (links) => {
    setFormData((prev) => ({ ...prev, portfolioLinks: links }));
  };

  const validateForm = () => {
    const newErrors = {};

    // 1. Resume validation
    if (!formData.resumeFile) {
      newErrors.resumeFile = 'Please upload your resume (PDF format only)';
    }

    // 2. Years of Experience
    if (formData.yearsOfExperience === '' || formData.yearsOfExperience === null) {
      newErrors.yearsOfExperience = 'Years of experience is required';
    } else if (isNaN(Number(formData.yearsOfExperience)) || Number(formData.yearsOfExperience) < 0) {
      newErrors.yearsOfExperience = 'Please enter a valid non-negative number';
    }

    // 3. Expected Salary
    if (!formData.expectedSalary) {
      newErrors.expectedSalary = 'Expected salary is required';
    } else if (isNaN(Number(formData.expectedSalary)) || Number(formData.expectedSalary) <= 0) {
      newErrors.expectedSalary = 'Please enter a valid positive salary amount';
    }

    // 4. Notice Period
    if (formData.noticePeriod === '' || formData.noticePeriod === null) {
      newErrors.noticePeriod = 'Notice period is required';
    } else if (isNaN(Number(formData.noticePeriod)) || Number(formData.noticePeriod) < 0) {
      newErrors.noticePeriod = 'Please enter a valid number of days';
    }

    // 5. Current Location
    if (!formData.currentLocation || !formData.currentLocation.trim()) {
      newErrors.currentLocation = 'Current location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Toaster('Please fix the errors in the form before submitting', 'error');
      return;
    }

    // Construct FormData for API payload
    const payload = new FormData();
    payload.append('resume', formData.resumeFile);
    payload.append('yearsOfExperience', formData.yearsOfExperience);
    payload.append('expectedSalary', formData.expectedSalary);
    payload.append('noticePeriod', formData.noticePeriod);
    payload.append('currentLocation', formData.currentLocation.trim());
    payload.append('message', formData.message.trim());
    payload.append('coverLetter', formData.coverLetter.trim());

    const validLinks = formData.portfolioLinks
      .filter((item) => Boolean(item.url && item.url.trim() !== ''))
      .map((item) => ({ platform: item.platform.toUpperCase(), url: item.url.trim() }));

    // Send as JSON string — backend parses JSON body field from multipart
    payload.append('portfolioLinks', JSON.stringify(validLinks));

    apply({ jobId: job?._id || job?.id, formData: payload });
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="bg-[#0e0c14] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-7">
      {/* Target Job Summary Banner */}
      {job && (
        <div className="bg-[#09080d] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-purple-300 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
                Applying For
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {job.title}
              </h2>
              <p className="text-xs text-zinc-400">{job.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            <span className="text-zinc-500">Mode:</span>
            <span className="text-white">{job.interviewMode || 'ONLINE'}</span>
          </div>
        </div>
      )}

      {/* Form Steps in a Single Flow */}
      <div className="space-y-6">
        {/* Section 1: Resume Upload */}
        <ApplicationFormSection
          stepNumber="1"
          title="Resume Upload"
          description="Upload your latest resume in PDF format"
          icon={FileText}
        >
          <ResumeUploader
            file={formData.resumeFile}
            onFileSelect={handleResumeSelect}
            onFileRemove={handleResumeRemove}
            error={errors.resumeFile}
          />
        </ApplicationFormSection>

        {/* Section 2: Professional Information */}
        <ApplicationFormSection
          stepNumber="2"
          title="Professional Information"
          description="Specify your experience, compensation expectations, and notice period"
          icon={Briefcase}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ExperienceInput
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              error={errors.yearsOfExperience}
            />

            <SalaryInput
              value={formData.expectedSalary}
              onChange={handleInputChange}
              error={errors.expectedSalary}
            />

            <FormInput
              label="Notice Period (Days)"
              name="noticePeriod"
              type="number"
              value={formData.noticePeriod}
              onChange={handleInputChange}
              placeholder="15"
              required={true}
              error={errors.noticePeriod}
              min={0}
              helperText="Number of days required before joining"
            />
          </div>
        </ApplicationFormSection>

        {/* Section 3: Personal Details */}
        <ApplicationFormSection
          stepNumber="3"
          title="Personal Details"
          description="Your current location for job placement consideration"
          icon={MapPin}
        >
          <FormInput
            label="Current Location"
            name="currentLocation"
            type="text"
            value={formData.currentLocation}
            onChange={handleInputChange}
            placeholder="Chatrapati Sambhaji Nagar"
            required={true}
            error={errors.currentLocation}
            icon={MapPin}
            helperText="City or location where you are currently based"
          />
        </ApplicationFormSection>

        {/* Section 4: Portfolio Information */}
        <ApplicationFormSection
          stepNumber="4"
          title="Portfolio Information"
          description="Share links to your GitHub, LinkedIn, or personal portfolio"
          icon={Globe}
        >
          <PortfolioInput
            links={formData.portfolioLinks}
            onChange={handlePortfolioLinksChange}
            error={errors.portfolioLinks}
          />
        </ApplicationFormSection>

        {/* Section 5: Candidate Message */}
        <ApplicationFormSection
          stepNumber="5"
          title="Candidate Message"
          description="Share why you feel you are a great fit for this role"
          icon={MessageSquare}
        >
          <FormTextarea
            label="Message to Organization"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="I feel I am a great fit for this role because..."
            rows={3}
            required={false}
            error={errors.message}
            helperText="Optional statement highlighting your suitability"
          />
        </ApplicationFormSection>

        {/* Section 6: Cover Letter */}
        <ApplicationFormSection
          stepNumber="6"
          title="Cover Letter"
          description="Provide an optional formal cover letter"
          icon={BookOpen}
        >
          <FormTextarea
            label="Cover Letter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            placeholder="Write your cover letter here..."
            rows={4}
            required={false}
            error={errors.coverLetter}
            helperText="Optional detailed cover letter"
          />
        </ApplicationFormSection>
      </div>

      {/* Bottom Actions */}
      <SubmitActions
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      />
    </form>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl my-auto space-y-4 max-h-[92vh] overflow-y-auto pr-1">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 bg-[#0e0c14] border border-white/10 rounded-2xl sticky top-0 z-10 backdrop-blur-md">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Job Application Form
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Complete all required details to submit your candidate profile
              </p>
            </div>

            <button
              onClick={onCancel}
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-2 sm:p-4">
      {/* Top Navigation Bar for Standalone View */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </button>

        <span className="text-xs font-medium text-zinc-400 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
          Application Form
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Job Application Form
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Provide your professional details, resume, and expectations to submit your application.
        </p>
      </div>

      {formContent}
    </div>
  );
}
