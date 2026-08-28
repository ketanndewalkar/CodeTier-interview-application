# Backend Model Schema Reference

This document provides a single reference for the MongoDB/Mongoose schemas used by the interview application backend. It explains the purpose of each model, the important fields, validation rules, and how the models relate to one another.

---

## 1. User Model

File: `user.model.js`

Model name: `User`

### Purpose
Represents a system user such as a candidate, interviewer, or organization representative.

### Fields
- `name` – display name of the user
- `username` – login/handle name
- `email` – unique email address
- `password` – hashed password
- `role` – one of:
  - `CANDIDATE`
  - `INTERVIEWER`
  - `ORGANIZATION`
- `skills` – array of skill strings
- `experience` – number of years of experience
- `timezone` – user timezone
- `availability` – free-form availability list
- `refreshToken` – refresh token for authentication

### Behavior
- Passwords are hashed automatically before saving.
- A helper method `comparePassword()` is available for login verification.

### Notes
- The model is stored under the MongoDB collection name `user` (lowercase), even though the Mongoose model is named `User`.

---

## 2. Job Opening Model

File: `job.model.js`

Model name: `Job` (created as `JobOpening` in Mongoose)

### Purpose
Represents a hiring opening posted by an organization.

### Fields
- `organizationId` – reference to the organization that created the job opening
- `title` – job title
- `description` – detailed description of the role
- `requiredSkills` – list of required skills
- `experience` – experience level, one of:
  - `FRESHER`
  - `JUNIOR`
  - `MID_LEVEL`
  - `SENIOR`
  - `LEAD`
  - `PRINCIPAL`
- `applicationStartDate` – when candidates may start applying
- `applicationDeadline` – last date to apply
- `interviewConfig.duration` – interview duration in minutes
- `interviewConfig.bufferTime` – gap time between interviews in minutes
- `status` – one of:
  - `DRAFT`
  - `OPEN`
  - `PAUSED`
  - `CLOSED`
  - `ARCHIVED`

### Notes
- This model is the central definition of a role being hired for.
- Applications are created against a specific job opening.

---

## 3. Application Model

File: `application.model.js`

Model name: `Application` (created as `JobApplication` in Mongoose)

### Purpose
Represents a candidate’s application for a particular job opening.

### Fields
- `candidateId` – reference to the applicant user
- `organizationId` – reference to the organization linked to the job
- `jobOpeningId` – reference to the job opening being applied for
- `resumeUrl` – URL to the candidate’s resume
- `coverLetter` – optional cover letter text
- `portfolioLinks` – list of portfolio links with platform and URL
- `yearsOfExperience` – years of professional experience
- `expectedSalary` – expected salary amount
- `noticePeriod` – notice period in days
- `currentLocation` – candidate’s current location
- `message` – optional message from the candidate
- `applicationStatus` – current application state, one of:
  - `APPLIED`
  - `SHORTLISTED`
  - `REJECTED`
  - `HIRED`
- `interviewId` – reference to a linked interview, when one exists

### Validation and Constraints
- A candidate can apply only once to the same job opening because a unique composite index exists on `candidateId` and `jobOpeningId`.
- Organization and job opening combinations are indexed for easier filtering.

### Notes
- This is the main record that ties a candidate to a role and later to an interview.

---

## 4. Interview Model

File: `interview.model.js`

Model name: `Interview`

### Purpose
Stores the actual interview scheduling record for a candidate and interviewer.

### Fields
- `applicationId` – reference to the application that created this interview
- `candidateId` – reference to the candidate
- `interviewerId` – reference to the assigned interviewer
- `organizationId` – reference to the organization
- `startTime` – interview start time
- `endTime` – interview end time
- `duration` – interview duration in minutes
- `status` – one of:
  - `SCHEDULED`
  - `IN_PROGRESS`
  - `COMPLETED`
  - `CANCELLED`
  - `RESCHEDULED`
- `meetingRoom` – optional meeting room or link identifier
- `scoringSnapshot.totalScore` – score from interview evaluation
- `scoringSnapshot.breakdown` – evaluation breakdown data
- `scoringSnapshot.rankedAlternatives` – alternative interviewer suggestions

### Indexes
- Index on `interviewerId`, `startTime`, and `endTime` to support conflict detection.
- Index on `organizationId` and `status` for filtering interviews by organization.
- A unique partial index prevents two active interviews with the same interviewer and start time from being created.

### Notes
- This model is the scheduling and audit record for interview execution.

---

## 5. Interviewer Availability Model

There are two similar schemas in the workspace for interviewer availability:
- `availability.model.js`
- `interviewavailability.model.js`

### Purpose
Stores the recurring availability and temporary blockouts for an interviewer.

### Common Fields
- `interviewerId` – reference to the interviewer user
- `timezone` – interviewer timezone
- `recurringAvailability` – list of recurring weekly time slots
- `blockedSlots` – list of date-based blocked periods

### Recurring slot structure
Each recurring availability entry includes:
- `day` – one of `MONDAY` to `SUNDAY`
- `startTime` – time string like `09:30`
- `endTime` – time string like `18:00`

### Blocked slot structure
Each blocked slot includes:
- `start` – start date/time
- `end` – end date/time
- `reason` – optional reason text

### Notes
- The workspace contains two versions of this concept; both represent the same idea and are closely related to scheduling logic.
- This model is primarily used to determine whether an interviewer can be assigned to a candidate interview.

---

## 6. Candidate Availability Model

File: `candidateavailability.model.js`

Model name: `CandidateAvailability`

### Purpose
Stores a candidate’s preferred interview slot availability for scheduling.

### Fields
- `applicationId` – reference to the candidate’s application
- `candidateId` – reference to the candidate user
- `timezone` – candidate timezone
- `slots` – list of preferred time ranges

### Slot structure
Each slot contains:
- `start` – start date/time
- `end` – end date/time

### Notes
- This model helps match candidate availability against interviewer availability.
- It is tied directly to a specific application.

---

## 7. Slot Schema

File: `slot.model.js`

### Purpose
A reusable sub-schema for a time range with a start and end time.

### Fields
- `start` – date/time
- `end` – date/time

### Notes
- This is not a standalone model. It is a reusable schema fragment used for availability-related structures.

---

## Relationship Overview

The models form the following main workflow:

1. A `User` can be a candidate, interviewer, or organization.
2. An `Organization` creates a `Job` opening.
3. A `Candidate` submits an `Application` for that job opening.
4. The application can later be linked to an `Interview`.
5. Interview scheduling uses:
   - `InterviewerAvailability` to understand interviewer free/busy time
   - `CandidateAvailability` to understand candidate preferred slots
6. The `Interview` record captures the final scheduled meeting and its outcome.

---

## Quick Summary

- `User` – identity and role information
- `Job` – job opening definition
- `Application` – candidate application record
- `Interview` – scheduled interview record
- `InterviewerAvailability` – interviewer free/busy schedule
- `CandidateAvailability` – candidate preferred interview slots
- `Slot` – reusable time range definition

This structure is designed to support a full interview workflow from job posting to candidate application and final interview scheduling.
