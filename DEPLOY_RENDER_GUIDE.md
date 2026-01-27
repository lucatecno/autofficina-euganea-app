# GUIDA DEPLOY RENDER - Backend

## Step 1: Crea Account Render

1. Vai su: https://render.com/
2. Clicca "Get Started for Free"
3. Scegli "Sign up with Email"
4. Email: autofficinaeuganea@libero.it
5. Password: (crea una password sicura o usa: AutofficinaRender2026!)
6. Conferma email (clicca link che arriva)

## Step 2: Crea Web Service

1. Dashboard Render → "New +" → "Web Service"
2. "Connect a repository" → Skip (useremo deploy manuale)
3. Oppure: "Deploy from Git" → Usa questo codice

## Configurazione:

**Name:** autofficina-backend
**Environment:** Python 3
**Build Command:** `pip install -r requirements.txt`
**Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`

## Environment Variables:

```
MONGO_URL=mongodb+srv://autofficina_user:Battagliaterme26.@autofficina-db.kzwvezn.mongodb.net/?appName=autofficina-db
DB_NAME=autofficina_db
APP_URL=https://autofficina-euganea.vercel.app
OFFICINA_EMAIL=autofficinaeuganea@libero.it
OFFICINA_PHONE=+393203145049
```

## URL Risultante:
https://autofficina-backend.onrender.com
