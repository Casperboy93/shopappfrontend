import { useTranslation } from 'react-i18next';

export const JOB_TYPES = [
  // Construction & Building
  'jobs.electrician', 'jobs.plumber', 'jobs.carpenter', 'jobs.painter', 'jobs.mason',
  'jobs.constructionWorker', 'jobs.tileInstaller', 'jobs.roofer', 'jobs.welder',
  'jobs.ironworker', 'jobs.inoxWorker', 'jobs.aluminumWorker', 'jobs.glassInstaller',
  'jobs.electricGateInstaller', 'jobs.locksmith', 'jobs.architect', 'jobs.civilEngineer',
  'jobs.surveyor', 'jobs.demolitionWorker', 'jobs.scaffolder', 'jobs.plasterer',
  'jobs.flooring', 'jobs.insulationWorker', 'jobs.waterproofing', 'jobs.interiorCarpenter',
  'jobs.marbleTileInstaller', 'jobs.aluminumRepair',
  
  // Automotive & Transportation
  'jobs.mechanic', 'jobs.driver', 'jobs.delivery', 'jobs.carWasher', 'jobs.carUpholsterer',
  'jobs.autoElectrician', 'jobs.tireRepair', 'jobs.carPainter', 'jobs.truckDriver',
  'jobs.taxiDriver', 'jobs.busDriver', 'jobs.motorcycleRepair', 'jobs.carBodywork',
  
  // Home Services & Maintenance
  'jobs.cleaner', 'jobs.housekeeper', 'jobs.windowCleaner', 'jobs.gardener',
  'jobs.acTechnician', 'jobs.refrigeratorRepair', 'jobs.applianceRepair',
  'jobs.pestControl', 'jobs.swimmingPoolCleaner', 'jobs.poolMaintenance',
  'jobs.satelliteInstaller', 'jobs.antennaInstaller', 'jobs.securitySystemInstaller',
  
  // Beauty & Personal Care
  'jobs.hairdresser', 'jobs.barber', 'jobs.makeupArtist', 'jobs.manicurist',
  'jobs.pedicurist', 'jobs.massageTherapist', 'jobs.beautician', 'jobs.eyebrowThreading',
  'jobs.henna', 'jobs.skinCare', 'jobs.waxing',
  
  // Food & Hospitality
  'jobs.cook', 'jobs.baker', 'jobs.pastryChef', 'jobs.caterer', 'jobs.waiter',
  'jobs.bartender', 'jobs.coffeeMaker', 'jobs.pizzaMaker', 'jobs.butcher',
  'jobs.fishmonger', 'jobs.fruitVendor', 'jobs.streetFoodVendor',
  
  // Textile & Fashion
  'jobs.tailor', 'jobs.seamstress', 'jobs.embroidery', 'jobs.leatherWorker',
  'jobs.shoemaker', 'jobs.shoeRepair', 'jobs.bagRepair', 'jobs.dryCleaners',
  'jobs.laundryService', 'jobs.carpetCleaner', 'jobs.upholsterer',
  
  // Technology & Electronics
  'jobs.itTechnician', 'jobs.mobileRepair', 'jobs.computerRepair', 'jobs.tvRepair',
  'jobs.electronicRepair', 'jobs.cameraRepair', 'jobs.printerRepair',
  'jobs.networkTechnician', 'jobs.webDeveloper', 'jobs.graphicDesigner',
  
  // Creative & Entertainment
  'jobs.photographer', 'jobs.videographer', 'jobs.dj', 'jobs.musician',
  'jobs.eventPlanner', 'jobs.weddingPlanner', 'jobs.decorator', 'jobs.interiorDesigner',
  'jobs.florist', 'jobs.artist', 'jobs.calligrapher',
  
  // Education & Childcare
  'jobs.tutor', 'jobs.teacher', 'jobs.babysitter', 'jobs.nanny', 'jobs.elderCare',
  'jobs.quranTeacher', 'jobs.languageTeacher', 'jobs.musicTeacher',
  'jobs.drivingInstructor', 'jobs.swimmingInstructor',
  
  // Health & Fitness
  'jobs.personalTrainer', 'jobs.physiotherapist', 'jobs.nurse', 'jobs.pharmacist',
  'jobs.dentist', 'jobs.optician', 'jobs.veterinarian', 'jobs.nutritionist',
  
  // Security & Safety
  'jobs.securityGuard', 'jobs.bodyguard', 'jobs.nightWatchman', 'jobs.fireExtinguisher',
  'jobs.emergencyResponse',
  
  // Agriculture & Livestock
  'jobs.farmer', 'jobs.shepherd', 'jobs.beekeeper', 'jobs.animalBreeder',
  'jobs.veterinaryAssistant', 'jobs.landscaper', 'jobs.treeTrimmimg',
  
  // Specialized Services
  'jobs.mover', 'jobs.dogWalker', 'jobs.petGroomer', 'jobs.translator',
  'jobs.interpreter', 'jobs.accountant', 'jobs.realEstateAgent', 'jobs.insurance',
  'jobs.legalAssistant', 'jobs.notaryAssistant', 'jobs.courier', 'jobs.postman',
  
  // Traditional Crafts
  'jobs.potter', 'jobs.woodCarver', 'jobs.metalWorker', 'jobs.jewelryMaker',
  'jobs.rugWeaver', 'jobs.basketWeaver', 'jobs.coppersmith', 'jobs.silversmith',
  'jobs.traditionalBuilder', 'jobs.zellijArtisan', 'jobs.plasterCarver'
];

export const useTranslatedJobTypes = () => {
  const { t } = useTranslation();
  return JOB_TYPES.map(jobKey => t(jobKey));
};
  