import React, { useState } from 'react';
import {
  Lock,
  X,
  UserCheck,
  KeyRound,
  ShieldAlert,
  UserPlus,
  CheckCircle2,
  Mail,
  Loader2,
  Clock,
} from 'lucide-react';
import { ExecutiveMember } from '../types';
import {
  supabase,
  chargerMaFiche,
  membreVersProfil,
  LIBELLES_ROLES,
  ROLES_INSCRIPTION,
  RoleMembre,
} from '../lib/supabase';

interface WorkspaceAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (member: ExecutiveMember) => void;
}

type Onglet = 'login' | 'register' | 'reset';

export function WorkspaceAuthModal({ isOpen, onClose, onLoginSuccess }: WorkspaceAuthModalProps) {
  const [onglet, setOnglet] = useState<Onglet>('login');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [info, setInfo] = useState('');

  // Connexion
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  // Inscription
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [role, setRole] = useState<RoleMembre>('eco_garde');
  const [motDePasse2, setMotDePasse2] = useState('');

  if (!isOpen) return null;

  const changerOnglet = (o: Onglet) => {
    setOnglet(o);
    setErreur('');
    setInfo('');
  };

  const traduireErreur = (message: string) => {
    const m = message.toLowerCase();
    if (m.includes('invalid login credentials')) return 'E-mail ou mot de passe incorrect.';
    if (m.includes('email not confirmed')) return "Votre adresse e-mail n'est pas encore confirmée. Ouvrez le lien reçu par e-mail.";
    if (m.includes('already registered')) return 'Un compte existe déjà avec cette adresse e-mail. Utilisez « Connexion ».';
    if (m.includes('password should be')) return 'Le mot de passe doit contenir au moins 8 caractères.';
    if (m.includes('rate limit')) return 'Trop de tentatives. Patientez quelques minutes puis réessayez.';
    return message;
  };

  const handleConnexion = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setInfo('');
    setChargement(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: motDePasse,
      });
      if (error) {
        setErreur(traduireErreur(error.message));
        return;
      }
      const fiche = await chargerMaFiche();
      if (!fiche) {
        setErreur('Votre fiche membre est introuvable. Contactez le CPI.');
        await supabase.auth.signOut();
        return;
      }
      if (fiche.statut === 'en_attente') {
        setInfo("Votre compte est bien créé mais attend l'approbation du DE ou du CPI. Vous serez prévenu dès son activation.");
        await supabase.auth.signOut();
        return;
      }
      if (fiche.statut === 'suspendu') {
        setErreur('Votre compte est suspendu. Contactez le CPI.');
        await supabase.auth.signOut();
        return;
      }
      onLoginSuccess(membreVersProfil(fiche));
      setMotDePasse('');
      onClose();
    } finally {
      setChargement(false);
    }
  };

  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setInfo('');
    if (motDePasse.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (motDePasse !== motDePasse2) {
      setErreur('Les deux mots de passe ne sont pas identiques.');
      return;
    }
    setChargement(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: motDePasse,
        options: {
          emailRedirectTo: window.location.origin,
          data: { nom_complet: nom.trim(), telephone: telephone.trim(), role },
        },
      });
      if (error) {
        setErreur(traduireErreur(error.message));
        return;
      }
      await supabase.auth.signOut();
      setInfo(
        "Inscription enregistrée. 1) Ouvrez l'e-mail de confirmation que vous venez de recevoir et cliquez sur le lien. 2) Votre compte sera ensuite approuvé par le DE ou le CPI."
      );
      setMotDePasse('');
      setMotDePasse2('');
      setOnglet('login');
    } finally {
      setChargement(false);
    }
  };

  const handleMotDePasseOublie = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setInfo('');
    setChargement(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) {
        setErreur(traduireErreur(error.message));
        return;
      }
      setInfo('Si un compte existe avec cette adresse, un e-mail de réinitialisation vient de vous être envoyé.');
    } finally {
      setChargement(false);
    }
  };

  const champ =
    'w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none';
  const bouton =
    'w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-5 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 mb-0.5">
                <span>Accès Restreint &amp; Traçabilité</span>
              </div>
              <h3 className="text-base sm:text-lg font-black">Espace de Travail AMSHARTE</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => changerOnglet('login')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              onglet !== 'register' ? 'border-emerald-600 text-emerald-800 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Connexion</span>
          </button>
          <button
            onClick={() => changerOnglet('register')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              onglet === 'register' ? 'border-emerald-600 text-emerald-800 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Inscription</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {erreur && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{erreur}</span>
            </div>
          )}
          {info && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2">
              <Clock className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{info}</span>
            </div>
          )}

          {onglet === 'login' && (
            <form onSubmit={handleConnexion} className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Espace réservé aux membres approuvés d'AMSHARTE. Chaque action est consignée dans le journal.
              </p>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Adresse e-mail *</label>
                <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={champ} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mot de passe *</label>
                <input type="password" required autoComplete="current-password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} className={champ} />
              </div>
              <button type="submit" disabled={chargement} className={bouton}>
                {chargement ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                <span>Entrer dans l'Espace de Travail</span>
              </button>
              <button type="button" onClick={() => changerOnglet('reset')} className="w-full text-2xs text-emerald-700 hover:underline">
                Mot de passe oublié ?
              </button>
            </form>
          )}

          {onglet === 'reset' && (
            <form onSubmit={handleMotDePasseOublie} className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Saisissez votre adresse e-mail : vous recevrez un lien pour choisir un nouveau mot de passe.
              </p>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Adresse e-mail *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={champ} />
              </div>
              <button type="submit" disabled={chargement} className={bouton}>
                {chargement ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                <span>Recevoir le lien</span>
              </button>
              <button type="button" onClick={() => changerOnglet('login')} className="w-full text-2xs text-slate-500 hover:underline">
                Retour à la connexion
              </button>
            </form>
          )}

          {onglet === 'register' && (
            <form onSubmit={handleInscription} className="space-y-3 text-xs sm:text-sm">
              <p className="text-xs text-slate-600 leading-relaxed">
                Créez votre compte. Il sera actif après confirmation de votre e-mail et approbation par le DE ou le CPI.
              </p>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nom &amp; Prénom *</label>
                <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} className={champ} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Rôle demandé *</label>
                <select value={role} onChange={(e) => setRole(e.target.value as RoleMembre)} className={`${champ} bg-white`}>
                  {ROLES_INSCRIPTION.map((r) => (
                    <option key={r} value={r}>{LIBELLES_ROLES[r]}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Adresse e-mail *</label>
                  <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={champ} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Téléphone</label>
                  <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="(+229) 01 ..." className={champ} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mot de passe * (8 caractères min.)</label>
                  <input type="password" required autoComplete="new-password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} className={champ} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Confirmer le mot de passe *</label>
                  <input type="password" required autoComplete="new-password" value={motDePasse2} onChange={(e) => setMotDePasse2(e.target.value)} className={champ} />
                </div>
              </div>
              <button type="submit" disabled={chargement} className={`${bouton} mt-2`}>
                {chargement ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Créer mon compte</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
