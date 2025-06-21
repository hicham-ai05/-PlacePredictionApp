console.log("🟢 Début de script Node.js...");

// 🔁 Étape 1 : Importer les modules nécessaires
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// 🚀 Étape 2 : Créer l'application Express
const app = express();

// 📦 Étape 3 : Configurer multer pour gérer les fichiers uploadés
const upload = multer({ dest: 'uploads/' });

// ✅ Étape 4 : Endpoint GET simple pour tester si le serveur fonctionne
app.get('/', (req, res) => {
  console.log('✅ Requête GET reçue sur /');
  res.send('🌐 Le serveur Node.js fonctionne correctement !');
});

// 🧠 Étape 5 : Endpoint POST pour recevoir une image et envoyer à l'API Flask
app.post('/api/predict', upload.single('image'), async (req, res) => {
  try {
    // 📂 Étape 5.1 : Vérifier si un fichier a bien été uploadé
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier envoyé' });
    }

    console.log('📸 Fichier reçu avec succès :', req.file.filename);

    // 📤 Étape 5.2 : Préparer le fichier pour envoi à l'API Flask
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));

    // 🔁 Étape 5.3 : Envoyer l'image à l'API Flask en POST
    const response = await axios.post('http://localhost:5000/predict', form, {
      headers: form.getHeaders(),
    });

    // ✅ Étape 5.4 : Retourner la prédiction au client
    console.log('📩 Prédiction reçue de Flask :', response.data);
    res.json({ prediction: response.data.prediction });

  } catch (err) {
    // ❌ Étape 6 : Gérer les erreurs
    console.error('⚠️ Erreur durant le traitement :', err.message);
    res.status(500).json({ error: 'Une erreur est survenue lors de la prédiction' });
  }
});

// 🟢 Étape 7 : Démarrer le serveur sur un port défini avec gestion d’erreur
const PORT = 3000;

try {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé : http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("❌ Erreur lors du démarrage du serveur :", error.message);
}
