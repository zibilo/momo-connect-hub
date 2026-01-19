import React from 'react';

export const LiveMatchIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-red-500">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
      <span className="font-semibold text-sm">LIVE</span>
    </div>
  );
};
