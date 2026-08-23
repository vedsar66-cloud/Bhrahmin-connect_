import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Heart, Send, AlertTriangle, Building2, Phone, User, CheckCircle2 } from 'lucide-react';
import { BloodGroup, BloodRequest } from '../types';
import { VILLAGES_LIST } from './lib/mockData';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (req: BloodRequest) => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose, onSubmitRequest }) => {
  const { t } = useTranslation();

  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [city, setCity] = useState(VILLAGES_LIST[0]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: BloodRequest = {
      id: `req-${Date.now()}`,
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      hospitalAddress,
      city,
      contactName,
      contactPhone,
      whatsapp: contactPhone,
      urgency: 'critical',
      reason,
      createdAt: new Date().toISOString(),
      isFulfilled: false,
    };

    onSubmitRequest(newRequest);
    setIsSubmitted(true);

    // Auto-generate WhatsApp Broadcast Message
    const message = encodeURIComponent(
      `🚨 *URGENT SAMAJ BLOOD REQUIREMENT* 🚨\n\n` +
      `🩸 *Blood Group:* ${bloodGroup}\n` +
      `💉 *Units Needed:* ${unitsRequired} Unit(s)\n` +
      `👤 *Patient:* ${patientName}\n` +
      `🏥 *Hospital:* ${hospitalName}, ${city}\n` +
      `📍 *Address:* ${hospitalAddress}\n` +
      `📞 *Contact Coordinator:* ${contactName} (${contactPhone})\n` +
      `📝 *Reason:* ${reason || 'Emergency Medical Care'}\n\n` +
      `_Please broadcast to all Samaj WhatsApp Groups immediately to save a life._`
    );

    // Open WhatsApp Share
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-red-200 flex flex-col max-h-[92vh]">
        
        {/* Header with Crimson urgent badge */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-4 text-white relative">
          <button
            id="close-sos-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-red-600 flex items-center justify-center shadow-lg font-bold">
              <Heart className="w-6 h-6 fill-current animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {t('blood.requestEmergencyBtn')}
                </h2>
                <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-white/30">
                  SOS 24x7
                </span>
              </div>
              <p className="text-xs text-red-100">
                {t('blood.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Emergency Alert Broadcasted!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your emergency blood requirement has been pinned to the top of the community feed and opened in WhatsApp for group broadcast.
              </p>
              <button
                id="done-sos-btn"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                {t('common.close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleBroadcast} className="space-y-3">
              
              {/* Alert notice */}
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 flex items-start space-x-2 text-xs text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>
                  Posting an SOS immediately notifies community donors and generates an urgent WhatsApp broadcast template.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('blood.patient')} *
                  </label>
                  <input
                    id="sos-patient-input"
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Patient Name"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-red-700 mb-1">
                    {t('blood.filterByGroup')} *
                  </label>
                  <select
                    id="sos-bloodgroup-select"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2 text-xs font-bold text-red-700 rounded-xl border border-red-300 focus:ring-2 focus:ring-red-500 bg-red-50/50"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('blood.units')} *
                  </label>
                  <input
                    id="sos-units-input"
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={unitsRequired}
                    onChange={(e) => setUnitsRequired(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Location *
                  </label>
                  <select
                    id="sos-city-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    {VILLAGES_LIST.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('blood.hospital')} Name & Ward *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="sos-hospital-input"
                    type="text"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g. Sterling Hospital, ICU Ward 3"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Coordinator *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="sos-contact-input"
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Ramesh Joshi"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Coordinator Mobile *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="sos-phone-input"
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medical Reason / Notes (Optional)
                </label>
                <textarea
                  id="sos-reason-input"
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Urgent heart bypass surgery in morning. Need replacement donors."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              <button
                id="submit-sos-broadcast-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{t('blood.whatsappShare')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
