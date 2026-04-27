#!/bin/bash

# ============================================
# SCRIPT POUR POUSSER LE PROJET SUR GITHUB
# ============================================

# REMPLACE "YOUR_USERNAME" par ton username GitHub!
# Puis exécute: bash push-to-github.sh

USERNAME="YOUR_USERNAME"
REPO_NAME="inventory-api"

if [ "$USERNAME" = "YOUR_USERNAME" ]; then
    echo "❌ ERREUR: Remplace YOUR_USERNAME par ton username GitHub!"
    echo "Édite ce fichier et change: USERNAME=\"YOUR_USERNAME\""
    exit 1
fi

echo "🚀 Pushing to GitHub..."
echo "Username: $USERNAME"
echo "Repo: $REPO_NAME"
echo ""

# Add remote
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main

echo ""
echo "✅ Done!"
echo "📂 Your repo: https://github.com/$USERNAME/$REPO_NAME"
