/*
# Expand Colleges and Companies Fields

This migration adds detailed fields for managing colleges and companies,
including SPOC (Single Point of Contact) information, MoU duration, and descriptions.

## Changes to Colleges Table
- Add address
- Add spoc_name, spoc_contact, spoc_email
- Add intouract_spoc_name, intouract_spoc_contact, intouract_spoc_email
- Add mou_duration
- Add description
- Remove onboard_status (replaced by description)

## Changes to Companies Table
- Same fields as colleges
*/

-- Update Colleges Table
ALTER TABLE colleges
ADD COLUMN address text,
ADD COLUMN spoc_name text,
ADD COLUMN spoc_contact text,
ADD COLUMN spoc_email text,
ADD COLUMN intouract_spoc_name text,
ADD COLUMN intouract_spoc_contact text,
ADD COLUMN intouract_spoc_email text,
ADD COLUMN mou_duration text,
ADD COLUMN description text,
DROP COLUMN onboard_status;

-- Update Companies Table
ALTER TABLE companies
ADD COLUMN address text,
ADD COLUMN spoc_name text,
ADD COLUMN spoc_contact text,
ADD COLUMN spoc_email text,
ADD COLUMN intouract_spoc_name text,
ADD COLUMN intouract_spoc_contact text,
ADD COLUMN intouract_spoc_email text,
ADD COLUMN mou_duration text,
ADD COLUMN description text,
DROP COLUMN onboard_status;

-- Add comments for documentation
COMMENT ON COLUMN colleges.address IS 'Physical address of the college';
COMMENT ON COLUMN colleges.spoc_name IS 'Single Point of Contact name from college';
COMMENT ON COLUMN colleges.spoc_contact IS 'SPOC phone number';
COMMENT ON COLUMN colleges.spoc_email IS 'SPOC email address';
COMMENT ON COLUMN colleges.intouract_spoc_name IS 'InTouract representative name';
COMMENT ON COLUMN colleges.intouract_spoc_contact IS 'InTouract representative phone';
COMMENT ON COLUMN colleges.intouract_spoc_email IS 'InTouract representative email';
COMMENT ON COLUMN colleges.mou_duration IS 'Duration of the MoU (e.g., "2 years", "1 year")';
COMMENT ON COLUMN colleges.description IS 'Additional notes and description';

COMMENT ON COLUMN companies.address IS 'Physical address of the company';
COMMENT ON COLUMN companies.spoc_name IS 'Single Point of Contact name from company';
COMMENT ON COLUMN companies.spoc_contact IS 'SPOC phone number';
COMMENT ON COLUMN companies.spoc_email IS 'SPOC email address';
COMMENT ON COLUMN companies.intouract_spoc_name IS 'InTouract representative name';
COMMENT ON COLUMN companies.intouract_spoc_contact IS 'InTouract representative phone';
COMMENT ON COLUMN companies.intouract_spoc_email IS 'InTouract representative email';
COMMENT ON COLUMN companies.mou_duration IS 'Duration of the MoU (e.g., "2 years", "1 year")';
COMMENT ON COLUMN companies.description IS 'Additional notes and description';
