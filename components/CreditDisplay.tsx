import React from 'react';
import { Credits } from '../services/supabaseClient';

interface CreditDisplayProps {
    credits: Credits | null;
    compact?: boolean;
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({ credits, compact = false }) => {
    if (!credits) {
        return null;
    }

    const totalCredits = credits.paid_credits + credits.free_credits;
    const isLow = totalCredits < 100; // Less than 1 video worth

    if (compact) {
        return (
            <div className={`credit-display-compact ${isLow ? 'low' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
                <span>{totalCredits.toLocaleString()}</span>

                <style>{`
          .credit-display-compact {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            color: #ccc;
            font-size: 14px;
            font-weight: 500;
          }

          .credit-display-compact.low {
            border-color: rgba(239, 68, 68, 0.5);
            color: #f87171;
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className={`credit-display ${isLow ? 'low' : ''}`}>
            <div className="credit-header">
                <span className="credit-label">Credits Remaining</span>
                <span className="credit-value">{totalCredits.toLocaleString()}</span>
            </div>
            <div className="credit-breakdown">
                <div className="credit-item">
                    <span>Paid</span>
                    <span>{credits.paid_credits.toLocaleString()}</span>
                </div>
                <div className="credit-item">
                    <span>Free</span>
                    <span>{credits.free_credits.toLocaleString()}</span>
                </div>
            </div>
            {isLow && (
                <div className="credit-warning">
                    ⚠️ Low credits - upgrade for more!
                </div>
            )}

            <style>{`
        .credit-display {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
        }

        .credit-display.low {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }

        .credit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .credit-label {
          color: #888;
          font-size: 13px;
        }

        .credit-value {
          color: #fff;
          font-size: 24px;
          font-weight: 700;
        }

        .credit-display.low .credit-value {
          color: #f87171;
        }

        .credit-breakdown {
          display: flex;
          gap: 24px;
        }

        .credit-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .credit-item span:first-child {
          color: #666;
          font-size: 12px;
        }

        .credit-item span:last-child {
          color: #ccc;
          font-size: 14px;
          font-weight: 500;
        }

        .credit-warning {
          margin-top: 12px;
          padding: 8px 12px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 8px;
          color: #f87171;
          font-size: 13px;
          text-align: center;
        }
      `}</style>
        </div>
    );
};

export default CreditDisplay;
