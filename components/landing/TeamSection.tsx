'use client';

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { Scale, ShoppingCart, Users, PieChart, ShieldCheck, Cog } from 'lucide-react';

export function TeamSection() {
  const { t } = useLanguage();

  const teams = [
    {
      key: 'legal',
      icon: Scale,
      ...t.teams.legal
    },
    {
      key: 'procurement',
      icon: ShoppingCart,
      ...t.teams.procurement
    },
    {
      key: 'hr',
      icon: Users,
      ...t.teams.hr
    },
    {
      key: 'finance',
      icon: PieChart,
      ...t.teams.finance
    },
    {
      key: 'grc',
      icon: ShieldCheck,
      ...t.teams.grc
    },
    {
      key: 'ops',
      icon: Cog,
      ...t.teams.ops
    }
  ];

  return (
    <div className="py-24 bg-[#0B1120] text-white overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            {t.teams.title} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
              {t.teams.titleHighlight}
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400"
          >
            {t.teams.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={team.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                <team.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{team.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {team.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
        >
            <button
              onClick={() => {
                const contactForm = document.getElementById('contact-form');
                contactForm?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              {t.teams.cta}
            </button>
        </motion.div>
      </div>
    </div>
  );
}
