import React, { useState } from 'react';
import { Profile } from '../services/supabaseClient';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userEmail: string;
    currentPlan: string;
}

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: '$0',
        period: 'forever',
        credits: '500 credits/month',
        videos: '~5 videos',
        features: [
            '500 free credits monthly',
            'Basic video generation',
            'All voice options',
            'All caption styles',
        ],
        limitations: [
            'No audio redo',
        ],
        priceId: null,
        popular: false,
    },
    {
        id: 'starter',
        name: 'Starter',
        price: '$9.99',
        period: '/month',
        credits: '3,500 credits/month',
        videos: '~35 videos',
        features: [
            '3,000 paid + 500 free credits',
            '50 audio redos/month',
            'Priority generation',
            'All premium features',
        ],
        limitations: [],
        priceId: 'price_1SikWL2MV8tNdeiZWcfVCKWc',
        popular: true,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$19.99',
        period: '/month',
        credits: '6,500 credits/month',
        videos: '~65 videos',
        features: [
            '6,000 paid + 500 free credits',
            '100 audio redos/month',
            'Priority generation',
            'All premium features',
            'Early access to new features',
        ],
        limitations: [],
        priceId: 'price_1SikWu2MV8tNdeiZpwgC2gOZ',
        popular: false,
    },
];

export const PricingModal: React.FC<PricingModalProps> = ({
    isOpen,
    onClose,
    userId,
    userEmail,
    currentPlan,
}) => {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubscribe = async (priceId: string, planId: string) => {
        if (!priceId) return;

        setIsLoading(planId);
        setError(null);

        try {
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    userId,
                    userEmail,
                    successUrl: `${window.location.origin}/?upgrade=success`,
                    cancelUrl: `${window.location.origin}/?upgrade=canceled`,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err: any) {
            setError(err.message);
            setIsLoading(null);
        }
    };

    return (
        <div className="pricing-modal-overlay" onClick={onClose}>
            <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="pricing-header">
                    <h2>Choose Your Plan</h2>
                    <p>Unlock more credits and features</p>
                    <button className="pricing-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="pricing-error">
                        {error}
                    </div>
                )}

                {/* Plans */}
                <div className="pricing-plans">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`pricing-plan ${plan.popular ? 'popular' : ''} ${currentPlan === plan.id ? 'current' : ''}`}
                        >
                            {plan.popular && <div className="popular-badge">Most Popular</div>}
                            {currentPlan === plan.id && <div className="current-badge">Current Plan</div>}

                            <h3>{plan.name}</h3>
                            <div className="plan-price">
                                <span className="price">{plan.price}</span>
                                <span className="period">{plan.period}</span>
                            </div>
                            <div className="plan-credits">{plan.credits}</div>
                            <div className="plan-videos">{plan.videos}</div>

                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="feature">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                                {plan.limitations.map((limitation, i) => (
                                    <li key={i} className="limitation">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6l12 12" />
                                        </svg>
                                        {limitation}
                                    </li>
                                ))}
                            </ul>

                            {plan.priceId ? (
                                <button
                                    className={`plan-btn ${plan.popular ? 'popular' : ''}`}
                                    onClick={() => handleSubscribe(plan.priceId!, plan.id)}
                                    disabled={isLoading !== null || currentPlan === plan.id}
                                >
                                    {isLoading === plan.id ? (
                                        <span className="btn-spinner"></span>
                                    ) : currentPlan === plan.id ? (
                                        'Current Plan'
                                    ) : (
                                        `Upgrade to ${plan.name}`
                                    )}
                                </button>
                            ) : (
                                <button className="plan-btn free" disabled>
                                    {currentPlan === 'free' ? 'Current Plan' : 'Free Forever'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <style>{`
          .pricing-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }

          .pricing-modal {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 20px;
            padding: 32px;
            width: 100%;
            max-width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }

          .pricing-header {
            text-align: center;
            margin-bottom: 32px;
            position: relative;
          }

          .pricing-header h2 {
            margin: 0 0 8px;
            font-size: 28px;
            font-weight: 700;
            color: #fff;
          }

          .pricing-header p {
            margin: 0;
            color: #888;
            font-size: 16px;
          }

          .pricing-close-btn {
            position: absolute;
            top: 0;
            right: 0;
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            padding: 4px;
            transition: color 0.2s;
          }

          .pricing-close-btn:hover {
            color: #fff;
          }

          .pricing-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #f87171;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            text-align: center;
          }

          .pricing-plans {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          @media (max-width: 768px) {
            .pricing-plans {
              grid-template-columns: 1fr;
            }
          }

          .pricing-plan {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            position: relative;
            transition: transform 0.2s, border-color 0.2s;
          }

          .pricing-plan:hover {
            transform: translateY(-4px);
            border-color: rgba(255, 255, 255, 0.2);
          }

          .pricing-plan.popular {
            border-color: #f97316;
            background: rgba(249, 115, 22, 0.05);
          }

          .pricing-plan.current {
            border-color: #22c55e;
          }

          .popular-badge {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
            color: #fff;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          .current-badge {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: #22c55e;
            color: #fff;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          .pricing-plan h3 {
            margin: 0 0 16px;
            font-size: 20px;
            font-weight: 600;
            color: #fff;
          }

          .plan-price {
            margin-bottom: 8px;
          }

          .plan-price .price {
            font-size: 36px;
            font-weight: 700;
            color: #fff;
          }

          .plan-price .period {
            font-size: 16px;
            color: #888;
          }

          .plan-credits {
            color: #f97316;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 4px;
          }

          .plan-videos {
            color: #888;
            font-size: 13px;
            margin-bottom: 20px;
          }

          .plan-features {
            list-style: none;
            padding: 0;
            margin: 0 0 24px;
          }

          .plan-features li {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 0;
            font-size: 14px;
          }

          .plan-features .feature {
            color: #ccc;
          }

          .plan-features .feature svg {
            color: #22c55e;
          }

          .plan-features .limitation {
            color: #888;
          }

          .plan-features .limitation svg {
            color: #ef4444;
          }

          .plan-btn {
            width: 100%;
            padding: 14px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .plan-btn:not(.popular):not(.free) {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
          }

          .plan-btn:not(.popular):not(.free):hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.15);
          }

          .plan-btn.popular {
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
            color: #fff;
          }

          .plan-btn.popular:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
          }

          .plan-btn.free {
            background: rgba(255, 255, 255, 0.05);
            color: #888;
          }

          .plan-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .btn-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        </div>
    );
};

export default PricingModal;
