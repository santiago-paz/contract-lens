'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Upload, Sparkles, FileEdit, CheckCircle2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function ProductShowcase() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Upload,
      image: "/screenshots-app/1.png",
      alignment: "left",
      step: "01",
      ...t.showcase.features[0]
    },
    {
      icon: Sparkles,
      image: "/screenshots-app/2.png",
      alignment: "right",
      step: "02",
      ...t.showcase.features[1]
    },
    {
      icon: FileEdit,
      image: "/screenshots-app/4.png",
      alignment: "left",
      step: "03",
      ...t.showcase.features[2]
    }
  ];

  return (
    <div id="product-showcase" className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 sm:mb-32 max-w-3xl">
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tighter mb-8">
            {t.showcase.title}
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed">
             {t.showcase.subtitle}
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${feature.alignment === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16 xl:gap-24`}
            >
              {/* Text Content */}
              <div className="flex-1 lg:flex-[0.8] space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Step {feature.step}
                  </span>
                </div>
                
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-4 pt-4">
                    {index === 0 && (
                        <>
                             <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                Drag & Drop Interface
                            </li>
                             <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                Support for Scanned PDFs
                            </li>
                        </>
                    )}
                    {index === 1 && (
                        <>
                             <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                Vendor Validation
                            </li>
                             <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                Real-time Feedback
                            </li>
                        </>
                    )}
                     {index === 2 && (
                        <>
                             <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                Side-by-side Comparison
                            </li>
                             <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                One-click Save
                            </li>
                        </>
                    )}
                </ul>
              </div>

              {/* Image */}
              <div className="flex-1 lg:flex-[1.2] w-full">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                  
                  <div className="relative rounded-xl overflow-hidden bg-gray-900 shadow-2xl ring-1 ring-gray-900/10 transform transition-transform duration-700 sm:group-hover:scale-[1.02]">
                     {/* Window Controls Mockup */}
                    <div className="h-10 bg-gray-800/80 backdrop-blur-md flex items-center px-4 gap-2 border-b border-gray-700">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                        
                        <div className="mx-auto text-xs font-medium text-gray-400 font-mono opacity-50"></div>
                    </div>
                    
                    <div className="relative bg-gray-800">
                        <Image
                        src={feature.image}
                        alt={feature.title}
                        width={1920}
                        height={1080}
                        quality={100}
                        className="w-full h-auto"
                        />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
