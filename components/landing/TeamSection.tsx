'use client';

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { scrollToSection } from './scroll';
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
    <section id="teams-section" aria-labelledby="teams-title" className="scroll-mt-24 py-24 sm:py-32 bg-black text-white overflow-hidden relative border-b-2 border-black">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#1a1a1a_0%,transparent_100%)] opacity-50 pointer-events-none" aria-hidden="true"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 sm:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-[#CCFF00] text-[#CCFF00] mb-6 font-mono text-xs uppercase tracking-widest"
          >
            <span className="w-2 h-2 bg-[#CCFF00]" aria-hidden="true"></span>
            {t.teams.matrixTitle}
          </motion.div>

          <motion.h2
            id="teams-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black mb-8 uppercase tracking-tight leading-[1.0] break-words hyphens-auto"
          >
            {t.teams.title} <br />
            <span className="text-[#CCFF00]">
              {t.teams.titleHighlight}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 font-mono max-w-2xl mx-auto border-l-4 border-[#CCFF00] pl-6 text-left md:text-center md:border-l-0 md:pl-0"
          >
            {t.teams.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team, index) => (
            <motion.div
              key={team.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-black border-2 border-white p-8 transition-all duration-300 relative hover:-translate-y-2 hover:border-[#CCFF00] hover:shadow-[8px_8px_0px_0px_#CCFF00]"
            >
              <div className="absolute top-4 right-4 text-[11px] font-mono text-gray-400 uppercase" aria-hidden="true">
                 0{index + 1}
              </div>

              <div className="w-14 h-14 border-2 border-white flex items-center justify-center mb-6 text-white" aria-hidden="true">
                <team.icon className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl font-black font-mono mb-4 uppercase tracking-tight">{team.title}</h3>
              <div className="w-8 h-1 bg-[#CCFF00] mb-4" aria-hidden="true"></div>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
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
            className="mt-24 text-center"
        >
            <button
              onClick={() => scrollToSection('contact-form')}
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold font-mono uppercase rounded-none text-black bg-[#CCFF00] border-2 border-black shadow-[6px_6px_0px_0px_#FFF] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus-visible:outline-white"
            >
              {t.teams.cta}
            </button>
        </motion.div>
      </div>
    </section>
  );
}
