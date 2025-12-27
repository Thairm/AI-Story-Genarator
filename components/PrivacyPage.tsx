import React from 'react';

interface PrivacyPageProps {
    onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
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
                <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-zinc-500 mb-8">Last updated: December 28, 2024</p>

                <div className="prose prose-invert prose-zinc max-w-none space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            StoryForge ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                            how we collect, use, disclose, and safeguard your information when you use our AI video generation service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
                        <p className="text-zinc-300 leading-relaxed">We collect the following types of information:</p>

                        <h3 className="text-lg font-medium text-white mt-4 mb-2">Account Information</h3>
                        <ul className="list-disc list-inside text-zinc-300 space-y-1">
                            <li>Email address</li>
                            <li>Name (if provided)</li>
                            <li>Profile picture (if using social login)</li>
                            <li>Password (encrypted)</li>
                        </ul>

                        <h3 className="text-lg font-medium text-white mt-4 mb-2">Payment Information</h3>
                        <ul className="list-disc list-inside text-zinc-300 space-y-1">
                            <li>Payment card details are processed securely by Stripe and never stored on our servers</li>
                            <li>Billing address</li>
                            <li>Transaction history</li>
                        </ul>

                        <h3 className="text-lg font-medium text-white mt-4 mb-2">Usage Information</h3>
                        <ul className="list-disc list-inside text-zinc-300 space-y-1">
                            <li>Videos and scripts you create</li>
                            <li>Feature usage and preferences</li>
                            <li>Device information and IP address</li>
                            <li>Browser type and operating system</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
                        <p className="text-zinc-300 leading-relaxed">We use your information to:</p>
                        <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                            <li>Provide and maintain our Service</li>
                            <li>Process your transactions and manage your subscription</li>
                            <li>Send you important service updates and notifications</li>
                            <li>Improve and personalize your experience</li>
                            <li>Analyze usage patterns to enhance our Service</li>
                            <li>Prevent fraud and ensure security</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Information Sharing</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We do not sell your personal information. We may share your information with:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                            <li><strong>Service Providers:</strong> Stripe (payments), Supabase (authentication), Vercel (hosting)</li>
                            <li><strong>AI Services:</strong> OpenAI, ElevenLabs for content generation (text/audio only, no personal data)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. Data Security</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We implement appropriate security measures to protect your information:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                            <li>Encryption in transit (HTTPS) and at rest</li>
                            <li>Secure authentication with Supabase</li>
                            <li>Regular security assessments</li>
                            <li>Limited access to personal data by employees</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">6. Data Retention</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We retain your information for as long as your account is active or as needed to provide services.
                            After account deletion, we may retain certain information for legal compliance purposes for up to
                            7 years. You can request deletion of your data by contacting support.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
                        <p className="text-zinc-300 leading-relaxed">You have the right to:</p>
                        <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Delete your account and data</li>
                            <li>Export your data</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                        <p className="text-zinc-300 leading-relaxed mt-3">
                            To exercise these rights, contact us at support@storyforge.app.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">8. Cookies</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We use essential cookies to maintain your session and remember your preferences.
                            We do not use advertising or tracking cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">9. Children's Privacy</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            Our Service is not intended for users under 13 years of age. We do not knowingly collect
                            information from children under 13.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">10. International Data Transfers</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            Your information may be transferred to and processed in countries other than your own.
                            We ensure appropriate safeguards are in place for such transfers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">11. Changes to This Policy</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We may update this Privacy Policy periodically. We will notify you of significant changes
                            via email or through the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">12. Contact Us</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            If you have questions about this Privacy Policy or our data practices, contact us at:
                        </p>
                        <p className="text-orange-400 mt-2">support@storyforge.app</p>
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

export default PrivacyPage;
