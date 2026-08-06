import React from 'react';
import { X, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import JobForm from './jobForm/JobForm';
import { useCreateJob, useUpdateJob } from '../../../pages/organization/hooks/useOrganization';

export default function CreateJobModal({ isOpen, onClose, onCreateJob, jobToEdit }) {
  const { mutate: createJobMutation, isPending: isCreating } = useCreateJob();
  const { mutate: updateJobMutation, isPending: isUpdating } = useUpdateJob();

  if (!isOpen) return null;

  const isSubmitting = isCreating || isUpdating;

  // Format initialData for JobForm structure
  const getInitialData = () => {
    if (!jobToEdit) return {};
    return {
      title: jobToEdit.title || '',
      description: jobToEdit.description || '',
      requiredSkills: jobToEdit.requiredSkills || [],
      experience: jobToEdit.experience || 'MID_LEVEL',
      applicationStartDate: jobToEdit.applicationStartDate ? new Date(jobToEdit.applicationStartDate).toISOString().split('T')[0] : '',
      applicationDeadline: jobToEdit.applicationDeadline ? new Date(jobToEdit.applicationDeadline).toISOString().split('T')[0] : '',
      interviewConfig: {
        duration: jobToEdit.interviewConfig?.duration ? `${jobToEdit.interviewConfig.duration} minutes` : '60 minutes',
        bufferTime: jobToEdit.interviewConfig?.bufferTime ? `${jobToEdit.interviewConfig.bufferTime} minutes` : '10 minutes',
        environmentId: jobToEdit.interviewConfig?.environmentId || ''
      },
      availabilityType: jobToEdit.availabilityType || 'FULL_TIME',
      compensation: {
        amount: jobToEdit.compensation?.amount || '',
        type: jobToEdit.compensation?.type || 'SALARY',
        currency: jobToEdit.compensation?.currency || 'INR',
        period: jobToEdit.compensation?.period || 'MONTHLY',
      },
      status: jobToEdit.status || 'DRAFT'
    };
  };

  const handleFormSubmit = (jobDocument) => {
    // Parse duration integer from string e.g. "60 minutes" -> 60
    const durationNum = parseInt(jobDocument.interviewConfig?.duration, 10) || 60;
    const bufferNum = parseInt(jobDocument.interviewConfig?.bufferTime, 10) || 15;

    // Build payload matching backend createJobOpening validation
    const payload = {
      title: jobDocument.title,
      description: jobDocument.description,
      requiredSkills: jobDocument.requiredSkills,
      experience: jobDocument.experience,
      applicationStartDate: jobDocument.applicationStartDate,
      applicationDeadline: jobDocument.applicationDeadline,
      interviewDuration: durationNum,
      bufferTime: bufferNum,
      environmentId: jobDocument.interviewConfig?.environmentId || "600000000000000000000001",
      interviewMode: "ONLINE",
      status: jobDocument.status,
      availabilityType: jobDocument.availabilityType,
      compensation: jobDocument.compensation,
    };

    if (jobToEdit) {
      updateJobMutation({ id: jobToEdit._id, data: payload }, {
        onSuccess: (updatedJob) => {
          toast.success(`Job opening updated: "${jobDocument.title}"`);
          if (onCreateJob) onCreateJob(updatedJob || jobDocument);
          onClose();
        },
        onError: (err) => {
          toast.error('Failed to update job opening.');
        }
      });
    } else {
      createJobMutation(payload, {
        onSuccess: (newJob) => {
          toast.success(`Job opening created: "${jobDocument.title}"`);
          if (onCreateJob) onCreateJob(newJob || jobDocument);
          onClose();
        },
        onError: (err) => {
          toast.error('Failed to create job opening.');
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#120e1a] border border-white/10 rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#120e1a]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2a1d3f] border border-[#6C4F91]/40 text-[#c084fc]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {jobToEdit ? 'Edit Job Opening' : 'Create Job Opening'}
              </h2>
              <p className="text-xs text-white/50">
                {jobToEdit ? 'Modify the details of your job opening' : 'Fill out all required schema fields for the job posting'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body containing JobForm */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <JobForm
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            initialData={getInitialData()}
            key={jobToEdit ? jobToEdit._id : 'new-job'}
          />
        </div>
      </div>
    </div>
  );
}

