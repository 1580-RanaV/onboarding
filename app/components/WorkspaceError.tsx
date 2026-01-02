'use client';

import { motion } from 'motion/react';

interface WorkspaceErrorProps {
  message?: string;
}

export default function WorkspaceError({ 
  message = "The workspace has already been created. You cannot create multiple workspaces." 
}: WorkspaceErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-4 bg-red-50 border border-red-200 rounded-sm"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900 mb-1">
            Workspace Already Created
          </h3>
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}

