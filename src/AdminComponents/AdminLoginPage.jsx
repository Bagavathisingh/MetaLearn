import { useNavigate } from "react-router-dom";
import { Adminauth } from "../../AdminFireBaseConfig";
import { useState, useEffect } from "react";
import eyeOff from "../assets/VisibleOff.svg";
import eyeOn from "../assets/VisibleOn.svg";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNotification } from "../components/Notification";

export default function AdminLoginPage() {
  const [eye, seteye] = useState(false);
  const AdminKey = import.meta.env.VITE_ADMIN_KEY;
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [securityKey, setSecurityKey] = useState("");
  const Navigate = useNavigate();
  const notify = useNotification();

  const handleEye = (e) => {
    e.preventDefault();
    seteye(!eye);
  };

  const Adminloginhandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(Adminauth, username, password);
    } catch (error) {
      notify("Authorization failed: " + error.message, "error");
      setLoading(false);
    }
  };

  const verifyKey = (e) => {
    e.preventDefault();
    if (securityKey === AdminKey) {
      notify("Master Access Granted.", "success");
      Navigate("/adminhome", { replace: true });
    } else {
      notify("Access Denied: Invalid Key Identifier.", "error");
      setShowKeyModal(false);
      setSecurityKey("");
      Adminauth.signOut();
      Navigate('/home');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Adminauth, (user) => {
      if (user) {
        setShowKeyModal(true);
      }
    });
    return () => unsubscribe();
  }, [AdminKey, notify]);

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-200 font-main overflow-hidden flex items-center justify-center p-6 lg:p-12">
      {/* Background Data Stream Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:32px_32px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-xl bg-slate-950/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12">
        {/* Header - Admin Identity */}
        <div className="space-y-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-heading font-black tracking-tighter text-white uppercase leading-none">Control_Login</h1>
              <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.2em] mt-1">Authorization_Required</p>
            </div>
          </div>
          <div className="h-px w-full bg-white/5" />
        </div>

        <form className="space-y-8" onSubmit={Adminloginhandle}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Admin_Identifier</label>
              <div className="relative group">
                <input
                  required
                  type="email"
                  placeholder="admin@system.node"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
                  onChange={(e) => setusername(e.target.value)}
                  value={username}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Access_Coefficient</label>
              <div className="relative group">
                <input
                  required
                  type={eye ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-700 font-mono tracking-widest"
                  onChange={(e) => setpassword(e.target.value)}
                  value={password}
                />
                <button
                  type="button"
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-cyan-400 transition-colors"
                  onClick={handleEye}
                >
                  <img src={eye ? eyeOff : eyeOn} className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity invert" alt="toggle" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-cyan-500 text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <span>Running_Auth</span>
              </>
            ) : (
              <span>Initialize_Session</span>
            )}
          </button>
        </form>

        {/* Footer Status */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span>Node_Status: Ready</span>
          </div>
          <div className="flex gap-4">
            <span>Uptime: 99.9%</span>
            <span className="text-cyan-500/50">#772-AD</span>
          </div>
        </div>
      </div>

      {/* Master Security Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-950 border border-cyan-500/20 rounded-[2rem] p-8 md:p-10 shadow-[0_0_50px_rgba(34,211,238,0.1)] relative overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Background Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />

            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-red-400">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-11a4 4 0 11-8 0 4 4 0 018 0zM7 10h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em]">Elevated_Privileges</h2>
                </div>
                <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tighter leading-tight">Master_Security_Key</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-relaxed">
                  Authentication successful. Input terminal key for full administrative bypass.
                </p>
              </div>

              <form onSubmit={verifyKey} className="space-y-6">
                <div className="space-y-2">
                  <input
                    autoFocus
                    required
                    type="password"
                    placeholder="KEY_ID_••••"
                    value={securityKey}
                    onChange={(e) => setSecurityKey(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-5 text-cyan-400 text-center text-xl outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all font-mono tracking-[0.5em] placeholder:text-slate-800"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-cyan-400 transition-all shadow-lg"
                  >
                    Verify_Master_Sequence
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      Adminauth.signOut();
                      setShowKeyModal(false);
                      setSecurityKey("");
                      Navigate('/home');
                    }}
                    className="w-full py-5 rounded-2xl border border-white/5 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all"
                  >
                    Abort_Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
