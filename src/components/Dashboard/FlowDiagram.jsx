import React from 'react';
import { motion } from 'framer-motion';
import { Factory, ArrowRight, Building2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const FlowDiagram = ({ data }) => {
  const { isPremium } = useTheme();

  if (!data || !data.shipmentPlan) return null;

  // Use actual shipment plan data or fallback to default flows
  const flows = data.shipmentPlan && data.shipmentPlan.length > 0 
    ? data.shipmentPlan.slice(0, 3).map(shipment => ({
        from: shipment.from,
        to: shipment.to,
        quantity: shipment.quantity,
        mode: shipment.mode
      }))
    : [
        { from: 'IU_Karnataka', to: 'GU_Odisha', quantity: 500, mode: 'Road' },
        { from: 'IU_Gujarat', to: 'GU_Maharashtra', quantity: 400, mode: 'Rail' },
        { from: 'IU_Rajasthan', to: 'GU_Punjab', quantity: 300, mode: 'Road' },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`p-6 rounded-xl ${
        isPremium
          ? 'glass-card'
          : 'bg-white shadow-sm border border-gray-200'
      }`}
    >
      <h3 className={`text-lg font-semibold mb-6 ${
        isPremium ? 'text-white' : 'text-gray-900'
      }`}>
        Clinker Flow Diagram
      </h3>

      <div className="space-y-6">
        {flows.map((flow, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center justify-between"
          >
            {/* Source */}
            <div className={`flex items-center space-x-3 p-4 rounded-lg ${
              isPremium
                ? 'bg-premium-neon/10 border border-premium-neon/30'
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <Factory className={isPremium ? 'text-premium-neon' : 'text-blue-600'} size={20} />
              <div>
                <p className={`font-medium ${isPremium ? 'text-white' : 'text-gray-900'}`}>
                  {flow.from}
                </p>
                <p className={`text-sm ${isPremium ? 'text-gray-300' : 'text-gray-600'}`}>
                  Integrated Unit
                </p>
              </div>
            </div>

            {/* Flow Arrow with Details */}
            <div className="flex-1 flex items-center justify-center mx-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                isPremium
                  ? 'bg-premium-gold/20 border border-premium-gold/30'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <ArrowRight className={isPremium ? 'text-premium-gold' : 'text-yellow-600'} size={16} />
                <span className={`text-sm font-medium ${
                  isPremium ? 'text-premium-gold' : 'text-yellow-700'
                }`}>
                  {flow.quantity}t via {flow.mode}
                </span>
                <ArrowRight className={isPremium ? 'text-premium-gold' : 'text-yellow-600'} size={16} />
              </div>
            </div>

            {/* Destination */}
            <div className={`flex items-center space-x-3 p-4 rounded-lg ${
              isPremium
                ? 'bg-premium-emerald/10 border border-premium-emerald/30'
                : 'bg-green-50 border border-green-200'
            }`}>
              <Building2 className={isPremium ? 'text-premium-emerald' : 'text-green-600'} size={20} />
              <div>
                <p className={`font-medium ${isPremium ? 'text-white' : 'text-gray-900'}`}>
                  {flow.to}
                </p>
                <p className={`text-sm ${isPremium ? 'text-gray-300' : 'text-gray-600'}`}>
                  Grinding Unit
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className={`mt-6 p-4 rounded-lg ${
        isPremium
          ? 'bg-white/5 border border-white/10'
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`font-medium ${isPremium ? 'text-gray-300' : 'text-gray-700'}`}>
            Total Clinker Flow
          </span>
          <span className={`text-xl font-bold ${
            isPremium ? 'premium-text-gradient' : 'text-gray-900'
          }`}>
            1,200 tons
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FlowDiagram;