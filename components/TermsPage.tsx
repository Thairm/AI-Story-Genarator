import React from 'react';

interface TermsPageProps {
    onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </button>
                    <span className="text-orange-500 font-bold text-xl">StoryForge</span>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
                <p className="text-zinc-500 mb-8">Last updated: December 28, 2024</p>

                <div className="prose prose-invert prose-zinc max-w-none space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            By accessing and using StoryForge ("the Service"), you accept and agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            StoryForge is an AI-powered video generation platform that allows users to create short-form video content
                            with AI-generated scripts, voiceovers, and background videos. The Service is provided on a subscription basis
                            with different tiers offering varying amounts of credits.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            To use certain features of the Service, you must register for an account. You are responsible for:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized use</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Subscription Plans and Payments</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We offer the following subscription plans:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                            <li><strong>Free Plan:</strong> 500 credits per month, no audio redo feature</li>
                            <li><strong>Starter Plan ($9.99/month):</strong> 3,500 credits per month, 50 audio redos</li>
                            <li><strong>Pro Plan ($19.99/month):</strong> 6,500 credits per month, 100 audio redos</li>
                        </ul>
                        <p className="text-zinc-300 leading-relaxed mt-3">
                            Subscriptions are billed monthly and automatically renew unless cancelled. Credits reset at the beginning of each billing cycle.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. Cancellation Policy</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            You may cancel your subscription at any time through your account settings or by contacting our support.
                            Upon cancellation:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                            <li>Your subscription will remain active until the end of the current billing period</li>
                            <li>You will not be charged for subsequent billing periods</li>
                            <li>Your account will be downgraded to the Free plan after the current period ends</li>
                            <li>Unused credits do not carry over after cancellation</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">6. Refund Policy</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            Due to the digital nature of our service:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                            <li>Refunds are generally not provided for used credits</li>
                            <li>If you experience technical issues preventing service use, contact support within 7 days for a potential refund</li>
                            <li>First-time subscribers may request a refund within 24 hours of purchase if no credits have been used</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">7. Acceptable Use</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            You agree not to use the Service to:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                            <li>Generate content that is illegal, harmful, or violates others' rights</li>
                            <li>Create misleading or deceptive content</li>
                            <li>Infringe on intellectual property rights</li>
                            <li>Attempt to reverse engineer or exploit the Service</li>
                            <li>Share account credentials with others</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">8. Intellectual Property</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            You retain ownership of the content you create using our Service. However, you grant us a license to
                            use anonymized data to improve our services. The StoryForge platform, including its design, features,
                            and technology, remains our intellectual property.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">9. Limitation of Liability</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            The Service is provided "as is" without warranties of any kind. We are not liable for any indirect,
                            incidental, or consequential damages arising from your use of the Service. Our total liability is
                            limited to the amount you paid for the Service in the past 12 months.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">10. Changes to Terms</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We may update these Terms from time to time. We will notify users of significant changes via email
                            or through the Service. Continued use after changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            If you have questions about these Terms, please contact us at:
                        </p>
                        <p className="text-orange-400 mt-2">Email: Thairm5719@proton.me</p>
                        <p className="text-orange-400">Phone: +81 80 1217 8914</p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-800 mt-12 py-6">
                <div className="max-w-4xl mx-auto px-6 text-center text-zinc-500 text-sm">
                    © 2024 StoryForge. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default TermsPage;
