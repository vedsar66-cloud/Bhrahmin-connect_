import React from 'react';

export const SkeletonMemberCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse flex flex-col space-y-3">
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
        <div className="h-3 bg-slate-100 rounded w-4/5" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
      </div>
      <div className="flex space-x-2 pt-1">
        <div className="flex-1 h-9 bg-slate-200 rounded-xl" />
        <div className="flex-1 h-9 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};

export const SkeletonDonorCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-red-50 shadow-sm animate-pulse flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-red-100" />
          <div className="space-y-1.5">
            <div className="h-4 bg-slate-200 rounded w-32" />
            <div className="h-3 bg-slate-100 rounded w-24" />
          </div>
        </div>
        <div className="w-12 h-8 rounded-lg bg-red-100" />
      </div>
      <div className="flex space-x-2 pt-2 border-t border-slate-100">
        <div className="flex-1 h-9 bg-slate-200 rounded-xl" />
        <div className="flex-1 h-9 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};

export const SkeletonBusinessCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse flex flex-col">
      <div className="h-36 bg-slate-200 w-full" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="flex space-x-2 pt-2">
          <div className="flex-1 h-9 bg-slate-200 rounded-xl" />
          <div className="flex-1 h-9 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
