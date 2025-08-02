// src/pages/Home.tsx
import TopUsers from '../components/common/TopUsers';
import Search from '../components/search/Search';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero / Presentation */}
      <section className="bg-gradient-dark text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-golden-500/10 via-transparent to-emerald-custom-500/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className=" bg-clip-text text-golden-500">{t('home.welcome')}</span> {t('common.to')}{' '}
            <span className="text-white">{t('home.title')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/search')}
              className="bg-gradient-golden text-dark-900 px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {t('home.findWorkers')}
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="border-2 border-emerald-custom-500 text-emerald-custom-400 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-custom-500 hover:text-white transition-all duration-200"
            >
              {t('home.joinAsWorker')}
            </button>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-16 bg-gradient-to-r from-dark-800 via-dark-900 to-dark-800 backdrop-blur-sm border-y border-golden-600/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-golden-500/3 via-transparent to-emerald-custom-500/3"></div>
        <div className="absolute top-0 left-1/4 w-24 h-24 bg-golden-500/8 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-emerald-custom-500/8 rounded-full blur-2xl"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-gradient-golden">{t('common.find')}</span> <span className="text-high-contrast">{t('home.findAWorker')}</span>
          </h2>
          <Search />
        </div>
      </section>

      {/* How to Start */}
      <section className="py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-golden-500/5 via-transparent to-emerald-custom-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-golden-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-custom-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-high-contrast">{t('home.howToStart')}</span>{' '}
            <span className="text-gradient-golden">{t('home.publishYourself')}</span>{' '}
            <span className="text-high-contrast">{t('home.asAWorker')}</span>
          </h2>
          <p className="text-gray-300 mb-12 text-lg leading-relaxed max-w-3xl mx-auto">
            {t('home.howToStartDescription')}
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card-dark rounded-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-golden-500/20 shadow-xl">
              <div className="w-16 h-16 bg-gradient-golden rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-dark-900 font-bold text-2xl">1</span>
              </div>
              <h3 className="text-golden-bright font-bold mb-3 text-lg">{t('home.step1Title')}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t('home.step1Description')}</p>
            </div>
            <div className="bg-card-emerald rounded-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-emerald-500/20 shadow-xl">
              <div className="w-16 h-16 bg-gradient-emerald rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-emerald-bright font-bold mb-3 text-lg">{t('home.step2Title')}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t('home.step2Description')}</p>
            </div>
            <div className="bg-card-dark rounded-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-white/10 shadow-xl border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-dark-900 font-bold text-2xl">3</span>
              </div>
              <h3 className="text-high-contrast font-bold mb-3 text-lg">{t('home.step3Title')}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t('home.step3Description')}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="btn-golden-enhanced px-10 py-4 rounded-xl font-bold text-lg shadow-2xl"
          >
            {t('home.startYourJourney')}
          </button>
        </div>
      </section>

      {/* Top 5 Users */}
      <TopUsers />
    </div>
  );
}
