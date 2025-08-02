import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-golden bg-clip-text text-transparent">{t('about.title').split(' ')[0]}</span>{' '}
            <span className="text-white">{t('about.title').split(' ')[1]}</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="backdrop-blur bg-white/5 border border-golden-600/20 rounded-xl p-8">
            <h2 className="text-3xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-golden rounded-full"></span>
              {t('about.ourStory')}
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('about.ourStoryContent1')}
            </p>
            <p className="text-gray-300 leading-relaxed">
              {t('about.ourStoryContent2')}
            </p>
          </div>
          
          <div className="backdrop-blur bg-white/5 border border-emerald-custom-600/20 rounded-xl p-8">
            <h2 className="text-3xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-emerald rounded-full"></span>
              {t('about.ourMission')}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              {t('about.ourMissionContent')}
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-golden-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{t('about.qualityAssurance')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-custom-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{t('about.fairOpportunities')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-golden-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{t('about.seamlessConnection')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;