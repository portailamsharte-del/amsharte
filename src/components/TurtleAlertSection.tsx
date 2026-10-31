import React, { useState } from 'react';
import { EmergencyTurtleAlert } from '../types';
import { INITIAL_EMERGENCY_ALERTS, NGO_INFO } from '../data/initialData';
import { AlertTriangle, Phone, Send, MapPin, CheckCircle2, ShieldAlert, HeartHandshake, Info, Clock, User } from 'lucide-react';

export const TurtleAlertSection: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyTurtleAlert[]>(INITIAL_EMERGENCY_ALERTS);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterType, setReporterType] = useState<EmergencyTurtleAlert['reporterType']>('riverain');
  const [location, setLocation] = useState('Togbin Plage (Zone Écloserie)');
  const [gpsCoordinates, setGpsCoordinates] = useState('6°21\'04.9"N 2°21\'08.0"E');
  const [turtleCondition, setTurtleCondition] = useState<EmergencyTurtleAlert['turtleCondition']>('piegee_filet');
  const [estimatedSize, setEstimatedSize] = useState<EmergencyTurtleAlert['estimatedSize']>('grande_adulte');
  const [description, setDescription] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        setGpsCoordinates(`${lat}°N, ${lng}°E`);
        setLocation(`Position GPS détectée (${lat}°N, ${lng}°E) - Littoral`);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        alert("Impossible de récupérer la position GPS. Vous pouvez la saisir manuellement.");
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName.trim() || !reporterPhone.trim() || !description.trim()) {
      alert("Veuillez renseigner votre nom, téléphone et la description de la situation.");
      return;
    }

    const newAlert: EmergencyTurtleAlert = {
      id: `alert-${Date.now()}`,
      reporterName: reporterName.trim(),
      reporterPhone: reporterPhone.trim(),
      reporterType,
      location,
      gpsCoordinates,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      turtleCondition,
      estimatedSize,
      description: description.trim(),
      status: 'transmis_urgence'
    };

    setAlerts([newAlert, ...alerts]);
    setSuccessMessage(`Alerte enregistrée avec succès ! L'équipe d'éco-gardes et la coordination de ${NGO_INFO.name} sont mobilisées.`);

    // WhatsApp Direct Link trigger
    const conditionLabels: Record<string, string> = {
      vivante_saine: 'Tortue vivante saine en balade',
      piegee_filet: 'Tortue PIÉGÉE DANS UN FILET (Urgence démaillage)',
      blessee: 'Tortue BLESSÉE / en détresse',
      ponte_en_cours: 'PONTE D\'ŒUFS EN COURS (Protéger le nid)',
      echouee_morte: 'Tortue échouée / morte (Examen scientifique)'
    };

    const text = encodeURIComponent(
      `🚨 ALERTE TORTUE MARINE — ${NGO_INFO.name}\n` +
      `De : ${newAlert.reporterName} (${newAlert.reporterPhone})\n` +
      `Statut : ${conditionLabels[newAlert.turtleCondition]}\n` +
      `Lieu : ${newAlert.location}\n` +
      `GPS : ${newAlert.gpsCoordinates}\n` +
      `Taille : ${newAlert.estimatedSize}\n` +
      `Détails : ${newAlert.description}`
    );

    window.open(`https://wa.me/2290195350862?text=${text}`, '_blank');

    // Reset form
    setDescription('');
  };

  return (
    <div id="turtle-alert-section" className="space-y-6">
      {/* Emergency Header */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 text-white p-5 sm:p-7 rounded-2xl border border-red-800/50 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-red-600/30 border border-red-500/50 px-3 py-1 rounded-full text-xs font-bold text-red-300">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Ligne Verte &amp; Sauvetage Immédiat 24h/24</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white">
              Guichet d'Alerte : Signaler une Tortue ou un Nid
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light">
              Pêcheur artisan, riverain ou touriste de plage : signalez immédiatement toute tortue piégée dans un filet, blessée ou en ponte. L'équipe d'éco-gardes de {NGO_INFO.name} et la Police BPLP interviennent rapidement.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <a
              href="tel:+2290195350862"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Phone className="w-4 h-4" />
              <span>Urgence : 01 95 35 08 62</span>
            </a>
            <a
              href="tel:+2290165408784"
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition border border-slate-700"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>01 65 40 87 84</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reporting Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Send className="w-4 h-4 text-teal-700" />
            <span>Formulaire de Signalement d'Urgence</span>
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Ce formulaire envoie instantanément la notification sur le groupe WhatsApp d'intervention de {NGO_INFO.name} et l'enregistre sur notre tableau de bord.
          </p>

          {successMessage && (
            <div className="mb-5 bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="leading-relaxed font-medium">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Votre Nom &amp; Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Koffi S., Pêcheur Togbin"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Téléphone de contact *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: (+229) 01 XX XX XX XX"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vous êtes :</label>
                <select
                  value={reporterType}
                  onChange={(e) => setReporterType(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800"
                >
                  <option value="pecheur">Pêcheur artisan</option>
                  <option value="riverain">Habitant riverain de Togbin</option>
                  <option value="touriste">Visiteur / Touriste</option>
                  <option value="eco_garde">Éco-garde / Patrouilleur</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">État de la tortue *</label>
                <select
                  value={turtleCondition}
                  onChange={(e) => setTurtleCondition(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-red-700"
                >
                  <option value="piegee_filet">🚨 Piégée dans un filet</option>
                  <option value="ponte_en_cours">🐢 Ponte d'œufs en cours</option>
                  <option value="blessee">🩹 Blessée / Affaiblie</option>
                  <option value="vivante_saine">🌊 Vivante saine sur la plage</option>
                  <option value="echouee_morte">⚠️ Échouée morte</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Taille estimée :</label>
                <select
                  value={estimatedSize}
                  onChange={(e) => setEstimatedSize(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800"
                >
                  <option value="grande_adulte">Grande adulte (&gt; 60 cm)</option>
                  <option value="moyenne_jeune">Moyenne / Juvénile (20-60 cm)</option>
                  <option value="petite_nouveau_ne">Très petite / Nouveau-né (&lt; 10 cm)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">Localisation sur la plage *</label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="text-teal-700 hover:text-teal-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{isLocating ? 'Détection en cours...' : 'Prendre mes coordonnées GPS actuelles'}</span>
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="Ex: Plage Togbin Fandji, 200m à l'ouest de l'écloserie"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal-500"
              />
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Coordonnées GPS associées : {gpsCoordinates}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Description de la situation *</label>
              <textarea
                rows={3}
                required
                placeholder="Précisez si le filet est déchiré, si des blessures sont visibles, ou si des personnes tentent de capturer l'animal..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Numéro d'astreinte : <strong className="text-slate-800">01 95 35 08 62</strong>
              </span>

              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer l'Alerte &amp; WhatsApp Direct</span>
              </button>
            </div>
          </form>
        </div>

        {/* Good practices & Protocol */}
        <div className="space-y-4">
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 text-xs text-amber-950 space-y-3">
            <h4 className="font-black text-amber-900 flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Gestes d'Urgence à Respecter</span>
            </h4>

            <ul className="space-y-2 text-amber-900/90 leading-relaxed list-disc list-inside">
              <li>
                <strong>Ne jamais tirer sur les nageoires :</strong> Si elle est prise dans un filet, ne forcez pas les articulations.
              </li>
              <li>
                <strong>Pas de lumière blanche dans les yeux :</strong> N'allumez pas les phares ou lampes blanches sur une femelle en ponte (utiliser filtre rouge).
              </li>
              <li>
                <strong>Garder à l'ombre et humide :</strong> En attendant l'éco-garde, couvrez délicatement la carapace d'un linge imbibé d'eau de mer.
              </li>
              <li>
                <strong>Interdiction de ramasser les œufs :</strong> La collecte et le transfert en écloserie sont réservés aux éco-gardes agréés.
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-700 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-teal-700" />
              <span>Garantie Pêcheurs Artisans</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              En cas de remise volontaire d'une tortue prise dans un filet, {NGO_INFO.name} octroie des <strong>pelotes de fil de réparation nylon</strong> pour compenser le temps de démaillage et réparer l'engin de pêche.
            </p>
          </div>

          {/* Recent alerts counter */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="text-xs font-bold text-slate-800 mb-2">Dernières Alertes Enregistrées :</div>
            <div className="space-y-2">
              {alerts.slice(0, 2).map((a) => (
                <div key={a.id} className="text-[11px] p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>{a.location}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                      {a.status === 'secourue_traitee' ? 'Secourue' : 'En cours'}
                    </span>
                  </div>
                  <p className="text-slate-500 line-clamp-1 mt-0.5">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
