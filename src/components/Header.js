import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton } from '@mui/material';

const Header = ({ onRefresh }) => (
  <header className="bg-blue-600 text-white p-4 shadow-md flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold">Smart Commute Optimizer</h1>
      <p className="text-sm opacity-90">Real-time multi-modal routing with live traffic & transit</p>
    </div>

    <div>
      {onRefresh && (
        <IconButton color="inherit" onClick={onRefresh} aria-label="refresh">
          <RefreshIcon />
        </IconButton>
      )}
    </div>
  </header>
);

export default Header;