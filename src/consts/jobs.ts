import { useTranslation } from 'react-i18next';

export const JOB_TYPES = [
  'jobs.electrician',
  'jobs.plumber', 
  'jobs.carpenter',
  'jobs.painter',
  'jobs.welder',
  'jobs.marbleTileInstaller',
  'jobs.aluminumWorker',
  'jobs.acTechnician',
  'jobs.applianceRepair',
  'jobs.upholsterer',
  'jobs.interiorDesigner'
];

export const useTranslatedJobTypes = () => {
  const { t } = useTranslation();
  return JOB_TYPES.map(jobKey => t(jobKey));
};
  