'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Upload, Sparkles, FileEdit } from 'lucide-react';

const features = [
  {
    title: "Simple Onboarding",
    description: "Start by uploading your contract or choosing a template. Our wizard guides you through the process, supporting both PDF and DOCX formats.",
    icon: Upload,
    image: "/screenshots-app/1.png",
    alignment: "left"
  },
  {
    title: "AI-Powered Analysis",
    description: "Watch as our engine analyzes the document structure, identifies partners, and extracts critical dates and metadata in seconds.",
    icon: Sparkles,
    image: "/screenshots-app/2.png",
    alignment: "right"
  },
  {
    title: "Full Control Editor",
    description: "Review extracted data side-by-side with your document. Edit fields, assign owners, and manage auto-renewals in a unified interface.",
    icon: FileEdit,
    image: "/screenshots-app/3.png",
    alignment: "left"
  }
];

export function ProductShowcase() {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gray-100"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            See SplitBerlin in Action
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
             From upload to active management, experience a workflow designed for finance teams.
          </p>
        </div>

        <div className="space-y-24 sm:space-y-32">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${feature.alignment === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-blue-600 font-medium tracking-wide text-sm uppercase">Step {index + 1}</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-3 pt-4">
                    {index === 0 && (
                        <>
                             <li className="flex items-center gap-3 text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                Drag & Drop Interface
                            </li>
                             <li className="flex items-center gap-3 text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                Support for Scanned PDFs
                            </li>
                        </>
                    )}
                    {index === 1 && (
                        <>
                             <li className="flex items-center gap-3 text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                Vendor Validation
                            </li>
                             <li className="flex items-center gap-3 text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                Real-time Feedback
                            </li>
                        </>
                    )}
                     {index === 2 && (
                        <>
                             <li className="flex items-center gap-3 text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                Side-by-side Comparison
                            </li>
                             <li className="flex items-center gap-3 text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                One-click Save
                            </li>
                        </>
                    )}
                </ul>
              </div>

              {/* Image */}
              <div className="flex-1 w-full">
                <div className="relative group">
                   {/* Shadow Effect */}
                  <div className="absolute -inset-4 bg-gray-200/50 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  
                  <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.01]">
                     {/* Window Controls Mockup */}
                    <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-200 border border-gray-300"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-200 border border-gray-300"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-200 border border-gray-300"></div>
                    </div>
                    
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={1200}
                      height={800}
                      className="w-full h-auto object-cover"
                    />
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
