import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, hasSupabaseConfig } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { IntroOverlay } from "@/components/IntroOverlay";
import { localAuth } from "@/services/localAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Shield, Zap, Star, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (hasSupabaseConfig) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) navigate("/");
      });
    } else {
      const s = localAuth.getSession();
      if (s) navigate("/");
    }
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsAnimating(true);

    try {
      if (hasSupabaseConfig) {
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          toast({ title: "Welcome back!", description: "Successfully logged in." });
        } else {
          const redirectUrl = `${window.location.origin}/`;
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: redirectUrl },
          });
          if (error) throw error;
          toast({ title: "Account created!", description: "You can now log in." });
          setIsLogin(true);
        }
      } else {
        // Local fallback
        if (isLogin) {
          localAuth.signIn(email, password);
          toast({ title: "Logged in (local)", description: "Using local session." });
        } else {
          localAuth.signUp(email, password);
          toast({ title: "Account created (local)", description: "Using local session." });
          setIsLogin(true);
        }
      }
      
      // Add success animation delay
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsAnimating(false);
    }
  };

  const toggleAuthMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Login" : "Sign Up"} - Smart Home Valuation</title>
        <meta name="description" content="Access your account to get AI-powered property valuations" />
      </Helmet>

      {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}

      <motion.div 
        className="min-h-screen bg-gradient-hero flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Features */}
          <motion.div 
            className="relative hidden md:block"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -inset-12 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md shadow-elevated p-8 flex flex-col justify-between overflow-hidden">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-white/90">Smart Home Valuation</h2>
                <p className="mt-2 text-white/70">AI-powered property estimates with Vastu considerations and traditional home insights.</p>
              </motion.div>
              
              <motion.div 
                className="self-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="h-40 w-40 rounded-full bg-white/20 blur-xl animate-pulse" />
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-between text-white/70 text-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Vastu Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>AI Powered</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div 
            className="relative"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute -inset-6 bg-white/40 dark:bg-white/10 blur-2xl rounded-3xl opacity-70" />
            <div className="relative bg-card/95 backdrop-blur-md rounded-3xl shadow-elevated p-8 border border-border/50 overflow-hidden">
              <div className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3">
                <div className="h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
              </div>

              <motion.div 
                className="text-center mb-8"
                key={isLogin ? 'login' : 'signup'}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin ? "Sign in to continue your journey" : "Start your property valuation journey"}
                </p>
              </motion.div>

              <motion.form 
                onSubmit={handleAuth} 
                className="space-y-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div 
                  className="space-y-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="bg-background/50 transition-all duration-300 focus:scale-105" 
                  />
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      minLength={6} 
                      className="bg-background/50 transition-all duration-300 focus:scale-105 pr-10" 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button 
                    type="submit" 
                    variant="hero" 
                    className="w-full transition-all duration-300 hover:scale-105" 
                    disabled={loading || isAnimating}
                  >
                    {loading ? (
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        {isLogin ? "Signing In..." : "Creating Account..."}
                      </motion.div>
                    ) : (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isLogin ? "Sign In" : "Create Account"}
                      </motion.span>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div 
                className="mt-6 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <button 
                  type="button" 
                  onClick={toggleAuthMode} 
                  className="text-sm text-primary hover:underline transition-all duration-300 hover:scale-105"
                  disabled={isAnimating}
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Auth;
