import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, ArrowRight, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '../components/Card';
import { PageTransition } from '../components/PageTransition';
import { useAuth } from '../services/AuthContext';

export const Login = () => {
    const { user, loading: authLoading, signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // If already logged in, redirect to dashboard
    if (authLoading) return null;
    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: authError } = await signIn(email, password);

        if (authError) {
            setError(authError.message);
            setLoading(false);
        }
        // On success, the AuthContext will update and the Navigate above will trigger
    };

    return (
        <PageTransition className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black" />
            <div className="absolute inset-0 bg-noise opacity-[0.03]" />

            {/* Login Container */}
            <div className="w-full max-w-md px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-6 group cursor-default">
                            <div className="absolute inset-0 bg-violet-600 blur-xl opacity-40 group-hover:opacity-60 transition-opacity rounded-full animate-pulse"></div>
                            <div className="relative bg-zinc-900 p-4 rounded-2xl border border-white/10 group-hover:border-violet-500/50 transition-colors shadow-2xl shadow-violet-500/10">
                                <Hexagon className="w-8 h-8 text-white fill-violet-500/20" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-zinc-500 text-sm">Sign in to access your admin dashboard</p>
                    </div>

                    <Card className="border-white/10 bg-zinc-900/60 shadow-2xl backdrop-blur-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                                    <p className="text-rose-300 text-sm">{error}</p>
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="name@company.com"
                                        className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-12 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                                    <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">Forgot password?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-12 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-zinc-500 text-xs">
                                Don't have an account? <a href="#" className="text-white hover:text-violet-400 transition-colors font-medium">Contact Administrator</a>
                            </p>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Footer / Copyright */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
                    TheTechArch Admin Panel V 2.0.26
                </p>
            </div>
        </PageTransition>
    );
};
