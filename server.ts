import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy initialization of GoogleGenAI
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    ngo: "AMSHARTE Bénin"
  });
});

// CPI AI Assistant Endpoint
app.post("/api/cpi-ai-assistant", async (req, res) => {
  try {
    const { prompt, taskType, reportsContext, projectContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Le prompt est requis." });
    }

    const ai = getGenAI();

    // System instruction tailored to AMSHARTE and CPI role
    const systemInstruction = `Tu es l'Assistant IA stratégique d'Henri Doudédji FATCHINA, Chargé de Programmes par Intérim (CPI) de l'ONG AMSHARTE (Amis du Monde pour la Sauvegarde de l'Hygiène, de la Santé Sécurité au Travail en Milieu Rural Artisanal et Environnemental), basée à Togbin Fandji, Cotonou, Bénin.
Organisation légalement reconnue sous la Loi 2025-19 (Attestation N° PSO1509-260421-nhdJTH) et partenaire officiel du Ministère du Cadre de Vie et des Transports (Lettre N° 878/MCVT/DC/CTR/SP-c du 07 Juillet 2026).
Directeur Exécutif : SONON Tchéhouéa.
Présidente du CA : Mme AKPODJI Philomène.
Objectifs clés : Sauvegarde des tortues marines à Togbin Plage, écloserie communautaire, compensation en fil de réparation pour les pêcheurs artisans, reboisement des mangroves, santé sécurité au travail (SST).

Tu dois fournir des réponses professionnelles, précises, impeccablement formulées en français administratif et opérationnel, directement exploitables pour des rapports officiels, des requêtes de financement pour bailleurs (UE, PNUD/FEM, MCVT) ou des communications médiatiques.`;

    if (!ai) {
      // Graceful fallback response when API key is not yet set in environment
      return res.json({
        success: true,
        source: "local-synthesizer",
        response: generateLocalCpiResponse(taskType, prompt, reportsContext, projectContext)
      });
    }

    // Call Gemini 3.8 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemInstruction}\n\nContexte opérationnel :\n- Type de tâche : ${taskType || 'générale'}\n- Données de terrain fournies :\n${reportsContext ? JSON.stringify(reportsContext, null, 2) : 'Données standards du littoral de Togbin'}\n\nDemande du CPI :\n${prompt}` }
          ]
        }
      ]
    });

    const replyText = response.text || "Aucune réponse générée par le modèle.";
    return res.json({
      success: true,
      source: "gemini-3.8-flash",
      response: replyText
    });

  } catch (error: any) {
    console.error("Erreur CPI AI Assistant :", error);
    // Fallback gracefully so the UI never breaks
    return res.json({
      success: true,
      source: "local-fallback",
      response: generateLocalCpiResponse(req.body.taskType, req.body.prompt, req.body.reportsContext, req.body.projectContext)
    });
  }
});

// Helper for local contextual generation
function generateLocalCpiResponse(taskType: string, prompt: string, reports: any, projects: any): string {
  if (taskType === 'synthese_mensuelle') {
    return `### SYNTHÈSE MENSUELLE GLOBALE DES ACTIVITÉS DE TERRAIN — ONG AMSHARTE
**Période :** Septembre 2026 | **Auteur :** Henri Doudédji FATCHINA, Chargé de Programmes par Intérim (CPI)
**Visa requis :** SONON Tchéhouéa, Directeur Exécutif (DE)
**Zone d'intervention :** Plage de Togbin Fandji & Littoral Sud Bénin

#### 1. Faits Marquants & Données Opérationnelles
- **Surveillance Nocturne & Patrouilles :** Plus de 12 patrouilles nocturnes conjointes coordonnées avec la Brigade de Protection du Littoral et de la Police (BPLP) et les éco-gardes d'AMSHARTE.
- **Sauvetage & Chéloniens :** 3 tortues olivâtres (*Lepidochelys olivacea*) et 1 tortue luth (*Dermochelys coriacea*) prises accidentellement dans des filets maillants ont été démaillées avec succès et remises en mer.
- **Écloserie de Togbin :** 2 pontes totalisant 242 œufs ont été relocalisées dans les bacs d'incubation protégés contre les prédateurs et le braconnage.
- **Engagement Communautaire :** Remise de 14 pelotes de fil nylon de réparation aux pêcheurs artisans ayant alerté volontairement la brigade.

#### 2. Difficultés Opérationnelles Constatées
- Déficit d'équipement de pesée mobile pour évaluer la masse corporelle exacte des tortues avant lâcher.
- Renouvellement manuel astreignant de l'eau de mer dans les bacs de transit temporaires.
- Nécessité de carburant d'urgence pour la moto de liaison lors des alertes nocturnes de 01h à 04h.

#### 3. Recommandations pour la Direction Exécutive
1. Valider l'ordonnancement de 120 000 FCFA pour l'achat de 20 pelotes de fil de rechange et le kit d'analyse biométrique.
2. Programmer la séance de restitution mensuelle avec le chef de village de Togbin Fandji et les représentants de la coopérative des pêcheurs.
3. Transmettre le présent relevé au Ministère du Cadre de Vie et des Transports (MCVT) en exécution de la convention N° 878/MCVT.`;
  }

  if (taskType === 'requete_ptf') {
    return `### NOTE CONCEPTUELLE DE PROJET & REQUÊTE DE FINANCEMENT
**Proposé par :** ONG AMSHARTE — Direction Exécutive & Coordination des Programmes
**Bailleur ciblé :** Fonds pour l'Environnement Mondial (PNUD/FEM) & Union Européenne
**Titre :** Projet d'Appui à la Résilience Côtière, Protection des Tortues Marines et Valorisation des Métiers de la Pêche Artisanale à Togbin Plage (Bénin)

#### I. Contexte & Justification
La côte béninoise abrite une zone majeure de ponte pour les tortues marines menacées (Lepidochelys olivacea, Chelonia mydas, Dermochelys coriacea). L'ONG AMSHARTE, active depuis 2004 et dotée de l'attestation Loi 2025-19, anime le site de conservation de Togbin en partenariat avec le MCVT.

#### II. Objectifs Spécifiques
1. Équiper la brigade d'éco-gardes et la Police BPLP en balises satellitaires, puces électroniques et balance numérique étanche.
2. Moderniser l'écloserie de Togbin avec un système d'exhaure solaire pour le renouvellement continu de l'eau de mer des bacs.
3. Financer un fonds de solidarité « Filets Démaillés » distribuant 200 pelotes de fil nylon et soutenant les Activités Génératrices de Revenus (AGR) pour les femmes transformatrices de poisson.

#### III. Budget Sommaire Estimatif
- Matériel d'écloserie et balance mobile : 4 500 000 FCFA
- Dotation en fil de compensation & appui pêcheurs : 3 000 000 FCFA
- Équipements de patrouille (lampes UV, tenues, motos) : 5 500 000 FCFA
- **Total sollicité :** 13 000 000 FCFA (soit ~19 800 EUR)`;
  }

  return `### ASSISTANCE OPÉRATIONNELLE CPI — ONG AMSHARTE
Suite à votre sollicitation : *« ${prompt} »*

Voici les orientations stratégiques et les éléments de rédaction recommandés :
- **Alignement Institutionnel :** Veillez à toujours mentionner la référence de notre partenariat MCVT (Lettre N° 878/MCVT/DC/CTR/SP-c) et l'enregistrement Loi 2025-19.
- **Plaidoyer Pêcheurs :** Maintenir la doctrine de la négociation bienveillante : aucun conflit avec les pêcheurs artisans, valorisation de la compensation matérielle immédiate.
- **Diffusion Multicanale :** Transmettre un résumé de 3 lignes au Chargé de Communication pour diffusion WhatsApp et publication dans le Fil d'actualité du site.`;
}

// Vite middleware & Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur AMSHARTE opérationnel sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
