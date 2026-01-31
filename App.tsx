
import React, { useState } from 'react';
import { CaseType, HesitationReason, UrgencyLevel, Language, CaseData } from './types';
import { generateFollowUpMessage } from './services/geminiService';

const DentalLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 120 120" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0073cc" />
        <stop offset="100%" stopColor="#33aaff" />
      </linearGradient>
    </defs>
    {/* Geometric Outer Shield / 'D' Shape */}
    <path 
      d="M30 20C30 14.4772 34.4772 10 40 10H70C86.5685 10 100 23.4315 100 40V80C100 96.5685 86.5685 110 70 110H40C34.4772 110 30 105.523 30 100V20Z" 
      fill="url(#logoGradient)" 
    />
    {/* Stylized Internal Tooth Silhouette */}
    <path 
      d="M48 35C48 32.2386 50.2386 30 53 30H77C79.7614 30 82 32.2386 82 35V65C82 72 78 78 72 82L65 88L58 82C52 78 48 72 48 65V35Z" 
      fill="white" 
      fillOpacity="0.9"
    />
    {/* Communication Dot / Follow-up Symbol */}
    <circle cx="65" cy="50" r="5" fill="#0073cc" />
    <path 
      d="M58 50H72" 
      stroke="#0073cc" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
    <path 
      d="M65 43V57" 
      stroke="#0073cc" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
  </svg>
);

const App: React.FC = () => {
  const [formData, setFormData] = useState<CaseData>({
    caseType: CaseType.IMPLANT,
    hesitationReason: HesitationReason.PRICE,
    urgencyLevel: UrgencyLevel.NORMAL,
    language: Language.AR_EGY,
    price: '',
    patientName: '',
    clinicName: '',
  });

  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateMessage = async () => {
    if (!formData.patientName || !formData.clinicName) {
      setError('Patient and Clinic names are required.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setResult('');
    setCopied(false);

    try {
      const message = await generateFollowUpMessage(formData);
      setResult(message);
    } catch (err) {
      setError('Communication error. Please check your connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateMessage();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(result)}`, '_blank');
  };

  const isArabic = formData.language.startsWith('Arabic');

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 bg-[#f4f7fa] text-slate-800 selection:bg-[#33aaff]/20">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 text-center">
          <div className="inline-flex flex-col items-center group cursor-default">
            <DentalLogo className="w-20 h-20 mb-6 drop-shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" />
            <h1 className="text-4xl font-black text-[#0073cc] tracking-tighter uppercase mb-2">
              DentaFollow <span className="text-[#33aaff]">Ai</span>
            </h1>
            <div className="h-1 w-12 bg-gradient-to-r from-[#0073cc] to-[#33aaff] rounded-full mb-3"></div>
            <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase opacity-70">
              Premium Patient Communication Portal
            </p>
          </div>
        </header>

        {/* Main Application Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-[0_20px_50px_rgba(0,115,204,0.1)] border border-white overflow-hidden transition-all duration-500">
          
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
            {/* Row 1: Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#0073cc] uppercase tracking-[0.2em] ml-2 block">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="e.g., Sarah Johnson"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-[#33aaff]/10 focus:border-[#33aaff] outline-none transition-all font-medium placeholder:text-slate-300"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#0073cc] uppercase tracking-[0.2em] ml-2 block">
                  Clinic Identity
                </label>
                <input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  placeholder="e.g., Elite Dental Care"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-[#33aaff]/10 focus:border-[#33aaff] outline-none transition-all font-medium placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            {/* Row 2: Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Dialect', name: 'language', options: Language },
                { label: 'Clinical Case', name: 'caseType', options: CaseType },
                { label: 'Patient Hesitation', name: 'hesitationReason', options: HesitationReason },
                { label: 'Priority', name: 'urgencyLevel', options: UrgencyLevel }
              ].map((item) => (
                <div key={item.name} className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">
                    {item.label}
                  </label>
                  <select
                    name={item.name}
                    value={(formData as any)[item.name]}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-[#33aaff]/10 outline-none font-bold text-slate-600 appearance-none cursor-pointer hover:bg-white hover:shadow-sm transition-all"
                  >
                    {Object.values(item.options).map(val => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Row 3: Optional Price */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">
                Treatment Estimate (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., $1,200"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-[#33aaff]/10 outline-none transition-all font-medium"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                  <i className="fa-solid fa-tag"></i>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 px-8 rounded-[28px] text-white font-black tracking-widest uppercase text-xs transition-all transform active:scale-[0.97] shadow-2xl flex items-center justify-center space-x-3 ${
                  isLoading 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#0073cc] to-[#33aaff] hover:shadow-[#0073cc]/40 hover:-translate-y-1'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Synthesizing Follow-up...</span>
                  </div>
                ) : (
                  <>
                    <i className="fa-solid fa-sparkles text-blue-200"></i>
                    <span>Generate Premium Message</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Area */}
          {result && (
            <div className="bg-[#0073cc]/5 border-t border-slate-100 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-[#0073cc] to-[#33aaff] rounded-full"></div>
                  <div>
                    <h3 className="text-xs font-black text-[#0073cc] uppercase tracking-[0.2em]">Generated Message</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Ready for patient review</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button
                    onClick={copyToClipboard}
                    className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl border transition-all text-xs font-black uppercase tracking-wider shadow-sm ${
                      copied 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-[#0073cc] hover:text-[#0073cc]'
                    }`}
                  >
                    <i className={copied ? "fa-solid fa-check" : "fa-regular fa-copy"}></i>
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-[#25D366] text-white hover:bg-[#128C7E] rounded-2xl transition-all text-xs font-black uppercase tracking-wider shadow-xl"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#0073cc]/10 to-[#33aaff]/10 rounded-[32px] blur-lg transition duration-1000 group-hover:duration-200 group-hover:opacity-100 opacity-50"></div>
                <textarea 
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className={`relative w-full min-h-[300px] resize-y p-10 bg-white border border-slate-100 rounded-[30px] leading-relaxed text-slate-700 outline-none focus:ring-4 focus:ring-[#33aaff]/5 transition-all ${isArabic ? 'font-arabic text-right' : 'text-left'}`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
                <div className="absolute bottom-6 right-8 text-[9px] text-slate-300 font-black uppercase tracking-widest pointer-events-none">
                  <i className="fa-solid fa-feather-pointed mr-1"></i> Interactive Draft
                </div>
              </div>

              <div className="mt-10 flex items-center justify-center">
                <div className="flex items-center px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Language optimized for {formData.language}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-8 mb-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-3xl flex items-center text-xs font-bold uppercase tracking-wider animate-bounce">
              <i className="fa-solid fa-triangle-exclamation mr-3 text-red-400"></i>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center space-y-4">
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
            Precision Engineering by DentaFollow Ai
          </p>
          <div className="flex justify-center space-x-4 opacity-30">
            <i className="fa-solid fa-shield-check text-[#0073cc]"></i>
            <i className="fa-solid fa-microchip text-[#0073cc]"></i>
            <i className="fa-solid fa-stethoscope text-[#0073cc]"></i>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
