import { useTranslation } from 'react-i18next';

export const MOROCCAN_CITIES = [
  'cities.casablanca', 'cities.rabat', 'cities.fes', 'cities.marrakech', 'cities.agadir', 'cities.tangier',
  'cities.oujda', 'cities.kenitra', 'cities.tetouan', 'cities.safi', 'cities.mohammedia', 'cities.elJadida',
  'cities.beniMellal', 'cities.nador', 'cities.taza', 'cities.khouribga', 'cities.errachidia', 'cities.settat',
  'cities.berrechid', 'cities.khemisset', 'cities.ksarElKebir', 'cities.larache', 'cities.guelmim',
  'cities.ouarzazate', 'cities.berkane', 'cities.taourirt', 'cities.sidiKacem', 'cities.sidiSlimane',
  'cities.khenifra', 'cities.alHoceima', 'cities.azrou', 'cities.midelt', 'cities.tiflet', 'cities.temara',
  'cities.skhirat', 'cities.ifrane', 'cities.essaouira', 'cities.laayoune', 'cities.dakhla', 'cities.tanTan',
  'cities.tiznit', 'cities.sefrou', 'cities.chefchaouen', 'cities.aitMelloul', 'cities.zagora',
  'cities.boujdour', 'cities.smara', 'cities.fquihBenSalah', 'cities.youssoufia', 'cities.meknes',
  'cities.taroudant', 'cities.jerada', 'cities.aklim', 'cities.aourir', 'cities.bouznika', 'cities.ouazzane',
  'cities.demnate', 'cities.guercif', 'cities.benGuerir', 'cities.azilal'
];

export const useTranslatedCities = () => {
  const { t } = useTranslation();
  return MOROCCAN_CITIES.map(cityKey => t(cityKey));
};