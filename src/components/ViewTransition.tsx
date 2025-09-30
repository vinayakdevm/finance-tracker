import React from 'react';

interface ViewTransitionProps {
  children: React.ReactNode;
  isTransitioning: boolean;
  currentView: string;
  previousView: string;
}

const ViewTransition: React.FC<ViewTransitionProps> = ({ 
  children, 
  isTransitioning, 
  currentView, 
  previousView 
}) => {
  return (
    <div className="relative w-full h-full">
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          isTransitioning 
            ? 'opacity-0 translate-y-4 scale-95' 
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default ViewTransition;