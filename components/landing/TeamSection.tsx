'use client';

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { Activity, Database, Banknote, Lock, ShieldCheck, Zap } from 'lucide-react';

export function TeamSection() {
  const { t } = useLanguage();

  const teams = [
    {
      key: 'legal',
      icon: Activity,
      ...t.teams.legal
    },
    {
      key: 'procurement',
      icon: Database,
      ...t.teams.procurement
    },
    {
      key: 'hr',
      icon: Banknote,
      ...t.teams.hr
    },
    {
      key: 'finance',
      icon: Lock,
      ...t.teams.finance
    },
    {
      key: 'grc',
      icon: ShieldCheck,
      ...t.teams.grc
    },
    {
      key: 'ops',
      icon: Zap,
      ...t.teams.ops
    }
  ];

  return (
    <div id="teams-section" className="py-24 bg-black text-white overflow-hidden relative border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-black mb-6 uppercase tracking-tighter"
          >
            {t.teams.title} <br />
            <span className="text-[#CCFF00]" style={{ WebkitTextStroke: '1px #CCFF00', color: 'transparent' }}>
              {t.teams.titleHighlight}
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 font-mono"
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
              className="bg-black border-2 border-white p-8 hover:bg-[#CCFF00] hover:text-black hover:border-black transition-colors duration-200 group"
            >
              <div className="w-12 h-12 border-2 border-white flex items-center justify-center mb-6 text-white group-hover:border-black group-hover:text-black">
                <team.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-mono mb-3 uppercase tracking-wide">{team.title}</h3>
              <p className="text-gray-400 font-mono text-sm leading-relaxed group-hover:text-black">
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
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold font-mono uppercase rounded-none text-black bg-[#CCFF00] border-2 border-[#CCFF00] hover:bg-black hover:text-[#CCFF00] transition-all shadow-hard"
            >
              {t.teams.cta}
            </button>
        </motion.div>
      </div>
    </div>
  );
}
