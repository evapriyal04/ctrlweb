"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserTie, FaUserCog, FaUserShield, FaUserFriends, FaUser, FaBook, FaUserAstronaut, FaLock, FaCheck, FaTimes, FaArrowLeft, FaPhone, FaEnvelope, FaKey } from "react-icons/fa";

// Load existing credentials from localStorage or use defaults
const getStoredCredentials = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('registeredUsers');
    if (stored) {
      return JSON.parse(stored);
    }
  }
  
  // Default credentials (Estate Manager is permanent)
  return {
    "Estate Manager": { 
      email: "estatemanager@ctrlweb.com", 
      password: "estatemanager123", 
      pin: "2468",
      phone: "+91 98765 43210",
      isRegistered: true 
    },
  };
};

// Security questions for each role
const securityQuestions = {
  "President": "What is the apartment complex name?",
  "Secretary": "What year was the society established?",
  "Joint Secretary": "How many blocks are in the complex?",
  "Treasurer": "What is the monthly maintenance amount?",
  "Joint Treasurer": "What is the society registration number?",
  "Estate Manager": "What is the total number of apartments?",
};

const securityAnswers = {
  "President": "GREENVALLEY",
  "Secretary": "2018",
  "Joint Secretary": "4",
  "Treasurer": "2500",
  "Joint Treasurer": "SOC123",
  "Estate Manager": "120",
};

const loginOptions = [
  { label: "President", icon: <FaUserFriends size={32} className="text-[#22223b] dark:text-white" /> },
  { label: "Secretary", icon: <FaUserTie size={32} className="text-[#22223b] dark:text-white" /> },
  { label: "Joint Secretary", icon: <FaUserCog size={32} className="text-[#22223b] dark:text-white" /> },
  { label: "Treasurer", icon: <FaUser size={32} className="text-[#22223b] dark:text-white" /> },
  { label: "Joint Treasurer", icon: <FaUserShield size={32} className="text-[#22223b] dark:text-white" /> },
  { label: "Estate Manager", icon: <FaUserAstronaut size={32} className="text-[#22223b] dark:text-white" /> },
];

const registrationRoles = [
  "President",
  "Secretary", 
  "Joint Secretary",
  "Treasurer",
  "Joint Treasurer"
];

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);
  const [enteredPin, setEnteredPin] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [roleCredentials, setRoleCredentials] = useState(getStoredCredentials());
  
  // Registration form state
  const [regForm, setRegForm] = useState({
    role: "",
    phone: "+91 ",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    const userCreds = roleCredentials[role];
    if (!userCreds || !userCreds.isRegistered) {
      setMessage(`${role} is not registered yet. Please register first.`);
      return;
    }

    setSelectedRole(role);
    setShowVerification(true);
    setVerificationStep(1);
    setEnteredPin("");
    setSecurityAnswer("");
    setAttempts(0);
    setMessage("");
  };

  const handlePinSubmit = () => {
    const correctPin = roleCredentials[selectedRole]?.pin;
    
    if (enteredPin === correctPin) {
      setVerificationStep(2);
      setMessage("PIN verified! Please answer the security question.");
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setMessage("Too many failed attempts. Please try again later.");
        setShowVerification(false);
        setSelectedRole("");
        return;
      }
      setMessage(`Incorrect PIN. ${2 - attempts} attempts remaining.`);
      setEnteredPin("");
    }
  };

  const handleSecuritySubmit = () => {
    const correctAnswer = securityAnswers[selectedRole as keyof typeof securityAnswers];
    
    if (securityAnswer.toUpperCase() === correctAnswer.toUpperCase()) {
      setIsLoading(true);
      setMessage(`Verification successful! Logging in as ${selectedRole}...`);
      
      setTimeout(() => {
        const credentials = roleCredentials[selectedRole];
        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('userEmail', credentials.email);
        setMessage(`Welcome, ${selectedRole}!`);
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }, 1500);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setMessage("Too many failed attempts. Access denied.");
        setShowVerification(false);
        setSelectedRole("");
        return;
      }
      setMessage(`Incorrect answer. ${2 - attempts} attempts remaining.`);
      setSecurityAnswer("");
    }
  };

  const cancelVerification = () => {
    setShowVerification(false);
    setSelectedRole("");
    setVerificationStep(1);
    setEnteredPin("");
    setSecurityAnswer("");
    setMessage("");
    setAttempts(0);
  };

  const handleRegistration = () => {
    setShowRegistration(true);
    setMessage("");
  };

  const handleRegistrationSubmit = () => {
    // Validation
    if (!regForm.role || !regForm.phone || !regForm.email || !regForm.password || !regForm.confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (regForm.phone.length < 14) {
      setMessage("Please enter a valid phone number.");
      return;
    }

    if (roleCredentials[regForm.role]?.isRegistered) {
      setMessage(`${regForm.role} is already registered.`);
      return;
    }

    // Generate PIN (last 4 digits of phone number)
    const pin = regForm.phone.slice(-4);

    // Create new user credentials
    const newCredentials = {
      ...roleCredentials,
      [regForm.role]: {
        email: regForm.email,
        password: regForm.password,
        phone: regForm.phone,
        pin: pin,
        isRegistered: true,
        registeredAt: new Date().toISOString()
      }
    };

    // Store in localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(newCredentials));
    setRoleCredentials(newCredentials);

    setMessage(`Registration successful! ${regForm.role} can now login with PIN: ${pin}`);
    
    // Reset form and go back to login after delay
    setTimeout(() => {
      setShowRegistration(false);
      setRegForm({
        role: "",
        phone: "+91 ",
        email: "",
        password: "",
        confirmPassword: ""
      });
      setMessage(`${regForm.role} registered successfully. You can now login.`);
    }, 3000);
  };

  const backToLogin = () => {
    setShowRegistration(false);
    setMessage("");
    setRegForm({
      role: "",
      phone: "+91 ",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e9f2] dark:bg-gray-900 px-2 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden w-full max-w-4xl border border-[#e6e6e6] dark:border-gray-600 transition-colors duration-300">
        {/* Left: Branding & Quick Links */}
        <div className="bg-[#22223b] dark:bg-gray-900 flex flex-col justify-between p-8 md:w-2/5 min-h-[500px] transition-colors duration-300">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/ctrlweb-logo.png" alt="CtrlWeb" className="w-10 h-10 rounded-full bg-white p-1 shadow" />
              <span className="text-2xl font-bold text-white tracking-wide">CtrlWeb AMS</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2 mt-6">Apartment Management System</h2>
            <ul className="space-y-3 mt-6">
              <li>
                <button 
                  onClick={() => {setShowRegistration(false); setShowVerification(false);}}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded font-semibold shadow transition text-left ${
                    !showRegistration ? 'bg-[#e41c24] text-white hover:bg-[#b81a1f]' : 'bg-[#f5e9f2] dark:bg-gray-700 text-[#22223b] dark:text-white hover:bg-[#e41c24] hover:text-white'
                  }`}
                >
                  <FaUser className="text-lg" /> Apartment Management Login
                </button>
              </li>
              <li>
                <button 
                  onClick={handleRegistration}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded font-semibold shadow transition text-left ${
                    showRegistration ? 'bg-[#e41c24] text-white hover:bg-[#b81a1f]' : 'bg-[#f5e9f2] dark:bg-gray-700 text-[#22223b] dark:text-white hover:bg-[#e41c24] hover:text-white'
                  }`}
                >
                  <FaUserFriends className="text-lg" /> Member Registration Page
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-2 px-4 py-2 rounded bg-[#f5e9f2] dark:bg-gray-700 text-[#22223b] dark:text-white font-semibold shadow hover:bg-[#e41c24] hover:text-white transition text-left">
                  <FaBook className="text-lg" /> Apartment Society Rules
                </button>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2 mt-8">
            <button className="flex items-center gap-2 px-4 py-2 rounded bg-white dark:bg-gray-600 text-[#22223b] dark:text-white font-semibold shadow hover:bg-[#e41c24] hover:text-white transition">
              <FaBook className="text-lg" /> Help Document
            </button>
          </div>
          <div className="mt-8 text-xs text-[#fff8] text-center">
            © 2025 CtrlWeb. All rights reserved.
          </div>
        </div>
        
        {/* Right: Dynamic Content */}
        <div className="flex-1 p-10 flex flex-col text-[#222] dark:text-white justify-center bg-white dark:bg-gray-800 transition-colors duration-300">
          {!showRegistration && !showVerification ? (
            /* Login Interface */
            <>
              <h1 className="text-2xl font-bold mb-2 text-[#22223b] dark:text-white text-center tracking-tight">
                Welcome to CtrlWeb Society Platform
              </h1>
              <div className="text-center text-[#e41c24] font-semibold mb-8">
                Minimal. Secure. Reliable.
              </div>
              
              {message && (
                <div className="text-center mb-6">
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                    message.includes('registered successfully') 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {message}
                  </div>
                </div>
              )}

              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-[#222] dark:text-white font-semibold text-lg">Select Your Role</span>
                  <span className="text-[#e41c24] text-xl">↓</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {loginOptions.map((opt) => {
                    const isRegistered = roleCredentials[opt.label]?.isRegistered;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleRoleSelect(opt.label)}
                        className={`flex flex-col items-center rounded-xl shadow px-6 py-6 transition cursor-pointer group ${
                          isRegistered 
                            ? 'bg-[#f5e9f2] dark:bg-gray-700 hover:bg-[#e41c24] hover:shadow-lg transform hover:scale-105' 
                            : 'bg-gray-100 dark:bg-gray-600 opacity-60 cursor-not-allowed'
                        }`}
                        title={isRegistered ? `Login as ${opt.label}` : `${opt.label} not registered`}
                        disabled={!isRegistered}
                      >
                        <div className={`transition-colors ${isRegistered ? 'group-hover:text-white' : 'text-gray-400'}`}>
                          {opt.icon}
                        </div>
                        <span className={`mt-3 font-semibold transition-colors text-sm text-center ${
                          isRegistered 
                            ? 'text-[#22223b] dark:text-white group-hover:text-white' 
                            : 'text-gray-400'
                        }`}>
                          {opt.label}
                        </span>
                        {!isRegistered && opt.label !== 'Estate Manager' && (
                          <span className="text-xs text-red-500 dark:text-red-400 mt-1">Not Registered</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Registration Status */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUserFriends className="text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Registration Status</h3>
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    {loginOptions.map(opt => (
                      <div key={opt.label} className="flex justify-between">
                        <span>{opt.label}:</span>
                        <span className={roleCredentials[opt.label]?.isRegistered ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {roleCredentials[opt.label]?.isRegistered ? '✓ Registered' : '✗ Not Registered'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : showRegistration ? (
            /* Registration Interface */
            <>
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={backToLogin}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <FaArrowLeft className="text-[#22223b] dark:text-white" />
                </button>
                <h1 className="text-2xl font-bold text-[#22223b] dark:text-white tracking-tight">
                  Member Registration Portal
                </h1>
              </div>
              
              <div className="text-center text-[#e41c24] font-semibold mb-8">
                Register as an Elected Member
              </div>

              {message && (
                <div className="text-center mb-6">
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                    message.includes('successful') 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {message}
                  </div>
                </div>
              )}

              <div className="max-w-md mx-auto space-y-4">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-[#22223b] dark:text-white mb-2">
                    <FaUserTie className="inline mr-2" />
                    Select Role
                  </label>
                  <select
                    value={regForm.role}
                    onChange={(e) => setRegForm({...regForm, role: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-[#e6e6e6] dark:border-gray-600 rounded-lg focus:border-[#e41c24] focus:outline-none bg-white dark:bg-gray-700 text-[#222] dark:text-white"
                  >
                    <option value="">Choose your role...</option>
                    {registrationRoles.map(role => (
                      <option 
                        key={role} 
                        value={role}
                        disabled={roleCredentials[role]?.isRegistered}
                      >
                        {role} {roleCredentials[role]?.isRegistered ? '(Already Registered)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-[#22223b] dark:text-white mb-2">
                    <FaPhone className="inline mr-2" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={regForm.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith('+91 ')) {
                        value = '+91 ' + value.replace(/^\+91\s*/, '');
                      }
                      setRegForm({...regForm, phone: value});
                    }}
                    className="w-full px-4 py-2 border-2 border-[#e6e6e6] dark:border-gray-600 rounded-lg focus:border-[#e41c24] focus:outline-none bg-white dark:bg-gray-700 text-[#222] dark:text-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#22223b] dark:text-white mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={regForm.email}
                    onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-[#e6e6e6] dark:border-gray-600 rounded-lg focus:border-[#e41c24] focus:outline-none bg-white dark:bg-gray-700 text-[#222] dark:text-white"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#22223b] dark:text-white mb-2">
                    <FaKey className="inline mr-2" />
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={regForm.password}
                    onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-[#e6e6e6] dark:border-gray-600 rounded-lg focus:border-[#e41c24] focus:outline-none bg-white dark:bg-gray-700 text-[#222] dark:text-white"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#22223b] dark:text-white mb-2">
                    <FaLock className="inline mr-2" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({...regForm, confirmPassword: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-[#e6e6e6] dark:border-gray-600 rounded-lg focus:border-[#e41c24] focus:outline-none bg-white dark:bg-gray-700 text-[#222] dark:text-white"
                  />
                </div>

                {/* Register Button */}
                <button
                  onClick={handleRegistrationSubmit}
                  className="w-full bg-[#e41c24] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#b81a1f] transition mt-6"
                >
                  <FaCheck className="inline mr-2" />
                  Register Member
                </button>

                {/* Info */}
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900 rounded-lg border border-amber-200 dark:border-amber-700 transition-colors duration-300">
                  <p className="text-xs text-amber-700 dark:text-amber-200">
                    <strong>Note:</strong> Your PIN will be the last 4 digits of your phone number. 
                    Estate Manager is a permanent role and cannot be registered here.
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Verification Interface */
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-[#22223b] dark:text-white mb-2">
                  Role Verification Required
                </h2>
                <p className="text-[#666] dark:text-gray-300 text-sm">Verifying access for: <strong>{selectedRole}</strong></p>
              </div>

              {verificationStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <FaLock className="text-4xl text-[#e41c24] mx-auto mb-4" />
                    <h3 className="font-semibold text-[#22223b] dark:text-white mb-2">Step 1: Enter PIN</h3>
                    <p className="text-sm text-[#666] dark:text-gray-300 mb-4">Enter the 4-digit PIN for {selectedRole}</p>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        type="password"
                        maxLength={1}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-[#e6e6e6] dark:border-gray-600 rounded-lg focus:border-[#e41c24] focus:outline-none bg-white dark:bg-gray-700 text-[#222] dark:text-white"
                        value={enteredPin[index] || ''}
                        onChange={(e) => {
                          const newPin = enteredPin.split('');
                          newPin[index] = e.target.value;
                          setEnteredPin(newPin.join(''));
                          
                          if (e.target.value && index < 3) {
                            const nextInput = e.target.parentElement?.children[index + 1] as HTMLInputElement;
                            nextInput?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handlePinSubmit}
                      disabled={enteredPin.length !== 4}
                      className="flex-1 bg-[#e41c24] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#b81a1f] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <FaCheck className="inline mr-2" /> Verify PIN
                    </button>
                    <button
                      onClick={cancelVerification}
                      className="px-4 py-2 border border-[#ccc] dark:border-gray-600 rounded-lg text-[#666] dark:text-gray-300 hover:bg-[#f5f5f5] dark:hover:bg-gray-700 transition"
                    >
                      <FaTimes className="inline" />
                    </button>
                  </div>
                </div>
              )}

              {verificationStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <FaUserShield className="text-4xl text-green-600 dark:text-green-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-[#22223b] dark:text-white mb-2">Step 2: Security Question</h3>
                  </div>
                  
                  <div className="bg-[#f5f5f5] dark:bg-gray-700 p-4 rounded-lg mb-4 transition-colors duration-300">
                    <p className="text-sm font-semibold text-[#22223b] dark:text-white">
                      {securityQuestions[selectedRole as keyof typeof securityQuestions]}
                    </p>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Enter your answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-[#e6e6e6] dark:border-gray-600 rounded-lg focus:border-[#e41c24] focus:outline-none bg-white dark:bg-gray-700 text-[#222] dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSecuritySubmit()}
                  />
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleSecuritySubmit}
                      disabled={!securityAnswer.trim() || isLoading}
                      className="flex-1 bg-[#e41c24] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#b81a1f] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {isLoading ? 'Verifying...' : 'Submit Answer'}
                    </button>
                    <button
                      onClick={cancelVerification}
                      disabled={isLoading}
                      className="px-4 py-2 border border-[#ccc] dark:border-gray-600 rounded-lg text-[#666] dark:text-gray-300 hover:bg-[#f5f5f5] dark:hover:bg-gray-700 transition disabled:opacity-50"
                    >
                      <FaTimes className="inline" />
                    </button>
                  </div>
                </div>
              )}

              {message && (
                <div className="mt-4 text-center">
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${
                    message.includes('Welcome') || message.includes('successful') 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : message.includes('verified') 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {message}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}