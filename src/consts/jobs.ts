import { useTranslation } from 'react-i18next';

export const JOB_TYPES = [
  'jobs.electrician', 'jobs.plumber', 'jobs.carpenter', 'jobs.painter', 'jobs.cleaner',
  'jobs.gardener', 'jobs.mechanic', 'jobs.acTechnician', 'jobs.mover', 'jobs.welder',
  'jobs.hairdresser', 'jobs.makeupArtist', 'jobs.tailor', 'jobs.baker', 'jobs.cook',
  'jobs.babysitter', 'jobs.securityGuard', 'jobs.mason', 'jobs.driver', 'jobs.delivery',
  'jobs.itTechnician', 'jobs.photographer', 'jobs.videographer', 'jobs.dj',
  'jobs.eventPlanner', 'jobs.interiorDesigner', 'jobs.housekeeper', 'jobs.dogWalker',
  'jobs.tutor', 'jobs.personalTrainer', 'jobs.laundryService', 'jobs.nanny',
  'jobs.constructionWorker', 'jobs.tileInstaller', 'jobs.roofer', 'jobs.windowCleaner',
  'jobs.carWasher', 'jobs.mobileRepair', 'jobs.electricGateInstaller',
  'jobs.glassInstaller', 'jobs.swimmingPoolCleaner', 'jobs.ironworker',
  'jobs.refrigeratorRepair', 'jobs.shoeRepair', 'jobs.locksmith', 'jobs.carUpholsterer',
  'jobs.seamstress', 'jobs.massageTherapist', 'jobs.manicurist', 'jobs.barber'
];

export const useTranslatedJobTypes = () => {
  const { t } = useTranslation();
  return JOB_TYPES.map(jobKey => t(jobKey));
};
  