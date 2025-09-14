"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiUsers,
  FiZap,
  FiTool,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiChevronDown,
  FiSettings,
  FiBarChart,
  FiShield,
  FiLogOut,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { BoxesCore } from "@/components/Boxes";
import { JoinRoomDialog } from "@/components/JoinRoom";
import { LoadingScreen } from "@/components/LoadingScreen";
import Image from "next/image";
import { useApp } from "@/contexts/AppContext";

const Home = () => {
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [authForm, setAuthForm] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const { currentUser, isLoggedIn, login, register, logout } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password) {
      alert("Please fill in all required fields");
      return;
    }

    const user = await login(authForm.email, authForm.password);
    if (user) {
      setShowAuthModal(false);
      setAuthForm({
        email: "",
        username: "",
        password: "",
        name: "",
        confirmPassword: "",
      });
    } else {
      alert("Invalid email or password");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !authForm.email ||
      !authForm.username ||
      !authForm.password ||
      !authForm.name
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (authForm.password !== authForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const user = await register({
      email: authForm.email,
      username: authForm.username,
      password: authForm.password,
      name: authForm.name,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    if (user) {
      setShowAuthModal(false);
      setAuthForm({
        email: "",
        username: "",
        password: "",
        name: "",
        confirmPassword: "",
      });
    } else {
      alert("Registration failed. Email or username may already exist.");
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleCreateAgent = () => {
    if (!isLoggedIn) {
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      router.push("/create-agent");
      setIsLoading(false);
    }, 1000);
  };

  const handleExistingAgents = () => {
    if (!isLoggedIn) {
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      router.push("/existing-agents");
      setIsLoading(false);
    }, 1000);
  };

  const handleJoinRoom = (roomId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/room/${roomId}`);
      setIsLoading(false);
    }, 1000);
  };

  const renderAuthModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md w-full mx-4"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {authMode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400">
            {authMode === "login"
              ? "Sign in to your FinLake account"
              : "Join FinLake and start trading with AI agents"}
          </p>
        </div>

        <form
          onSubmit={authMode === "login" ? handleLogin : handleRegister}
          className="space-y-4"
        >
          {authMode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                value={authForm.name}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="John Doe"
              />
            </div>
          )}

          {authMode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username *
              </label>
              <Input
                type="text"
                value={authForm.username}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, username: e.target.value }))
                }
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="johndoe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email *
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="bg-gray-800 border-gray-600 text-white pl-10"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type={showPassword ? "text" : "password"}
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="bg-gray-800 border-gray-600 text-white pl-10 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {authMode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={authForm.confirmPassword}
                  onChange={(e) =>
                    setAuthForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="bg-gray-800 border-gray-600 text-white pl-10"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-gray-100 py-3"
          >
            {authMode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {authMode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() =>
                setAuthMode(authMode === "login" ? "register" : "login")
              }
              className="text-white hover:underline"
            >
              {authMode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>
        </div>

        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ×
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <BoxesCore />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-4">
            <Image src="/logo.png" alt="FinLake Logo" width={40} height={46} />
            <h1 className="text-2xl font-bold text-white">FinLake</h1>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <FiUser className="w-5 h-5" />
                  <span>{currentUser?.name}</span>
                  <FiChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => {
                        router.push("/my-agents");
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-700"
                    >
                      <FiUsers className="w-4 h-4" />
                      <span>My Agents</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-700"
                    >
                      <FiBarChart className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push("/configuration");
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-700"
                    >
                      <FiSettings className="w-4 h-4" />
                      <span>Configuration</span>
                    </button>
                    <hr className="my-2 border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-700 text-red-400"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <FiLogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setAuthMode("register");
                    setShowAuthModal(true);
                  }}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <FiUserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content - Same for both logged in and out */}
        <main className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 flex items-center justify-center space-x-4"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src="/logo.png"
                  alt="FinLake Logo"
                  width={80}
                  height={92}
                />
                <h1 className="text-6xl font-extrabold text-white">FinLake</h1>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-xl text-gray-300 text-center">
                Create your own Agentic AI to automate trading!
              </p>

              <div className="flex justify-center space-x-6">
                <Button
                  onClick={handleCreateAgent}
                  className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-600/20 flex items-center space-x-2 pointer-events-auto border border-gray-600"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Create Agent</span>
                </Button>

                <Button
                  onClick={handleExistingAgents}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-6 text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-600/20 flex items-center space-x-2 pointer-events-auto border border-gray-600"
                >
                  <FiUsers className="w-5 h-5" />
                  <span>Existing Agents</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <motion.div
                  className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiZap className="w-8 h-8 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Lightning-fast AI processing
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Real-time market analysis and instant trade execution
                  </p>
                </motion.div>
                <motion.div
                  className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiUsers className="w-8 h-8 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Leverage other's agents
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Access and subscribe to proven trading strategies
                  </p>
                </motion.div>
                <motion.div
                  className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiTool className="w-8 h-8 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Create your custom AI agent
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Build and deploy your own trading algorithms
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>{showAuthModal && renderAuthModal()}</AnimatePresence>

      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}

      {/* Join Room Dialog */}
      <JoinRoomDialog
        isOpen={isJoinDialogOpen}
        onClose={() => setIsJoinDialogOpen(false)}
      />
    </div>
  );
};

export default Home;
