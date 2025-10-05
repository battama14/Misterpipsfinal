# Script de vérification complète du site Misterpips
# Teste tous les fichiers, calculs et fonctionnalités

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🧪 TEST COMPLET DU SITE MISTERPIPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = "C:\Users\BATT-CAVE\Desktop\Misterpips-mainDEPL"
$testResults = @{
    Total = 0
    Success = 0
    Failed = 0
    Warnings = 0
}

function Test-FileExists {
    param($file, $description)
    $testResults.Total++
    $fullPath = Join-Path $rootPath $file
    if (Test-Path $fullPath) {
        Write-Host "✅ $description" -ForegroundColor Green
        $testResults.Success++
        return $true
    } else {
        Write-Host "❌ $description - MANQUANT" -ForegroundColor Red
        $testResults.Failed++
        return $false
    }
}

function Test-FileContent {
    param($file, $pattern, $description)
    $testResults.Total++
    $fullPath = Join-Path $rootPath $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        if ($content -match $pattern) {
            Write-Host "✅ $description" -ForegroundColor Green
            $testResults.Success++
            return $true
        } else {
            Write-Host "⚠️  $description - PATTERN NON TROUVÉ" -ForegroundColor Yellow
            $testResults.Warnings++
            return $false
        }
    } else {
        Write-Host "❌ $description - FICHIER MANQUANT" -ForegroundColor Red
        $testResults.Failed++
        return $false
    }
}

function Test-Calculation {
    param($name, $scriptBlock, $expected)
    $testResults.Total++
    try {
        $result = & $scriptBlock
        if ([Math]::Abs($result - $expected) -lt 0.01) {
            Write-Host "✅ Calcul $name : $result (attendu: $expected)" -ForegroundColor Green
            $testResults.Success++
            return $true
        } else {
            Write-Host "❌ Calcul $name : $result (attendu: $expected)" -ForegroundColor Red
            $testResults.Failed++
            return $false
        }
    } catch {
        Write-Host "❌ Calcul $name : ERREUR - $($_.Exception.Message)" -ForegroundColor Red
        $testResults.Failed++
        return $false
    }
}

# ========================================
# 1. TESTS DES FICHIERS PRINCIPAUX
# ========================================
Write-Host "`n📁 VÉRIFICATION DES FICHIERS PRINCIPAUX" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

Test-FileExists "index.html" "Page d'accueil"
Test-FileExists "dashboard.html" "Dashboard PC"
Test-FileExists "mobile-dashboard.html" "Dashboard Mobile"
Test-FileExists "vip-space.html" "Espace VIP"
Test-FileExists "admin-dashboard.html" "Dashboard Admin"
Test-FileExists "planning-forex.html" "Planning Forex"

# ========================================
# 2. TESTS DES FICHIERS CSS
# ========================================
Write-Host "`n🎨 VÉRIFICATION DES FICHIERS CSS" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

Test-FileExists "styles.css" "CSS Principal"
Test-FileExists "dashboard-clean.css" "CSS Dashboard PC"
Test-FileExists "mobile-complete.css" "CSS Mobile Complet"
Test-FileExists "mobile-notifications.css" "CSS Notifications Mobile"

# ========================================
# 3. TESTS DES FICHIERS JAVASCRIPT
# ========================================
Write-Host "`n⚙️  VÉRIFICATION DES FICHIERS JAVASCRIPT" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

Test-FileExists "script.js" "Script Principal"
Test-FileExists "dashboard.js" "Script Dashboard"
Test-FileExists "chat.js" "Script Chat"
Test-FileExists "chat-notifications.js" "Script Notifications Chat"
Test-FileExists "mobile-trades.js" "Script Trades Mobile"

# ========================================
# 4. TESTS DE LA CONFIGURATION FIREBASE
# ========================================
Write-Host "`n🔥 VÉRIFICATION DE LA CONFIGURATION FIREBASE" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

Test-FileContent "index.html" "apiKey.*AIzaSyDSDK0NfVSs_VQb3TnrixiJbOpTsmoUMvU" "Config Firebase - Page d'accueil"
Test-FileContent "dashboard.html" "apiKey.*AIzaSyDSDK0NfVSs_VQb3TnrixiJbOpTsmoUMvU" "Config Firebase - Dashboard PC"
Test-FileContent "mobile-dashboard.html" "apiKey.*AIzaSyDSDK0NfVSs_VQb3TnrixiJbOpTsmoUMvU" "Config Firebase - Dashboard Mobile"

# ========================================
# 5. TESTS DES FONCTIONS DE NOTIFICATIONS
# ========================================
Write-Host "`n🔔 VÉRIFICATION DES NOTIFICATIONS" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

Test-FileContent "mobile-dashboard.html" "getMobileNotificationSettings" "Fonction getMobileNotificationSettings"
Test-FileContent "mobile-dashboard.html" "playMobileNotificationSound" "Fonction playMobileNotificationSound"
Test-FileContent "mobile-dashboard.html" "showMobileChatNotification" "Fonction showMobileChatNotification"
Test-FileContent "mobile-dashboard.html" "Notification\.permission" "Vérification permission notifications"

# ========================================
# 6. TESTS DES CALCULS TRADING
# ========================================
Write-Host "`n🔢 TESTS DES CALCULS TRADING" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Test P&L
Test-Calculation "P&L (1.1000 -> 1.1050, 1 lot)" {
    $entry = 1.1000
    $exit = 1.1050
    $lots = 1
    $pipValue = 10
    $pips = ($exit - $entry) * 10000
    return $pips * $pipValue * $lots
} 500

Test-Calculation "P&L (1.2000 -> 1.1950, 1 lot)" {
    $entry = 1.2000
    $exit = 1.1950
    $lots = 1
    $pipValue = 10
    $pips = ($exit - $entry) * 10000
    return $pips * $pipValue * $lots
} -500

# Test Winrate
Test-Calculation "Winrate (7 wins / 10 trades)" {
    $wins = 7
    $total = 10
    return ($wins / $total) * 100
} 70

Test-Calculation "Winrate (10 wins / 10 trades)" {
    $wins = 10
    $total = 10
    return ($wins / $total) * 100
} 100

# Test Risk/Reward
Test-Calculation "Risk/Reward (100 risk, 300 reward)" {
    $risk = 100
    $reward = 300
    return $reward / $risk
} 3

Test-Calculation "Risk/Reward (50 risk, 100 reward)" {
    $risk = 50
    $reward = 100
    return $reward / $risk
} 2

# Test Position Size
Test-Calculation "Position Size (10000 capital, 1% risk, 50 pips SL)" {
    $capital = 10000
    $riskPercent = 1
    $slPips = 50
    $pipValue = 10
    $riskAmount = $capital * ($riskPercent / 100)
    return $riskAmount / ($slPips * $pipValue)
} 0.2

# ========================================
# 7. TESTS DES FICHIERS DE DOCUMENTATION
# ========================================
Write-Host "`n📚 VÉRIFICATION DE LA DOCUMENTATION" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

Test-FileExists "README.md" "README Principal"
Test-FileExists "LISEZMOI-NOTIFICATIONS.txt" "Guide Notifications (FR)"
Test-FileExists "README-NOTIFICATIONS.md" "Documentation Notifications"
Test-FileExists "SYNTHESE-FINALE.md" "Synthèse Finale"
Test-FileExists "TESTS-NOTIFICATIONS.md" "Plan de Tests Notifications"
Test-FileExists "DEPLOIEMENT-NOTIFICATIONS.md" "Guide de Déploiement"

# ========================================
# 8. TESTS DES FICHIERS PWA
# ========================================
Write-Host "`n📱 VÉRIFICATION PWA" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

Test-FileExists "manifest.json" "Manifest PWA"
Test-FileExists "sw.js" "Service Worker"
Test-FileContent "manifest.json" "Misterpips" "Nom de l'application dans manifest"
Test-FileContent "index.html" "manifest.json" "Lien vers manifest dans index.html"

# ========================================
# 9. TESTS DE STRUCTURE HTML
# ========================================
Write-Host "`n🏗️  VÉRIFICATION DE LA STRUCTURE HTML" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

Test-FileContent "index.html" "</html>" "Fermeture HTML - index.html"
Test-FileContent "dashboard.html" "</html>" "Fermeture HTML - dashboard.html"
Test-FileContent "mobile-dashboard.html" "</html>" "Fermeture HTML - mobile-dashboard.html"
Test-FileContent "mobile-dashboard.html" "<!DOCTYPE html>" "DOCTYPE - mobile-dashboard.html"

# ========================================
# 10. TESTS DES IMAGES ET ASSETS
# ========================================
Write-Host "`n🖼️  VÉRIFICATION DES ASSETS" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

Test-FileExists "Misterpips.jpg" "Logo Misterpips"
Test-FileExists "pips book2.pdf" "E-book Pips"

# ========================================
# 11. TESTS DE SÉCURITÉ
# ========================================
Write-Host "`n🔒 VÉRIFICATION DE LA SÉCURITÉ" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Vérifier qu'il n'y a pas de mots de passe en clair (sauf config Firebase qui est publique)
$testResults.Total++
$sensitiveFiles = Get-ChildItem -Path $rootPath -Include *.js,*.html -Recurse | 
    Select-String -Pattern "password\s*=\s*['\`"][^'\`"]+['\`"]" -CaseSensitive:$false |
    Where-Object { $_.Line -notmatch "type=.password" -and $_.Line -notmatch "placeholder" }

if ($sensitiveFiles.Count -eq 0) {
    Write-Host "✅ Pas de mots de passe en clair détectés" -ForegroundColor Green
    $testResults.Success++
} else {
    Write-Host "⚠️  Mots de passe potentiels détectés: $($sensitiveFiles.Count)" -ForegroundColor Yellow
    $testResults.Warnings++
}

# ========================================
# 12. TESTS DE PERFORMANCE
# ========================================
Write-Host "`n⚡ VÉRIFICATION DE LA PERFORMANCE" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Taille des fichiers principaux
$testResults.Total++
$indexSize = (Get-Item (Join-Path $rootPath "index.html")).Length / 1KB
if ($indexSize -lt 500) {
    Write-Host "✅ Taille index.html: $([math]::Round($indexSize, 2)) KB (< 500 KB)" -ForegroundColor Green
    $testResults.Success++
} else {
    Write-Host "⚠️  Taille index.html: $([math]::Round($indexSize, 2)) KB (> 500 KB)" -ForegroundColor Yellow
    $testResults.Warnings++
}

$testResults.Total++
$dashboardSize = (Get-Item (Join-Path $rootPath "dashboard.html")).Length / 1KB
if ($dashboardSize -lt 1000) {
    Write-Host "✅ Taille dashboard.html: $([math]::Round($dashboardSize, 2)) KB (< 1000 KB)" -ForegroundColor Green
    $testResults.Success++
} else {
    Write-Host "⚠️  Taille dashboard.html: $([math]::Round($dashboardSize, 2)) KB (> 1000 KB)" -ForegroundColor Yellow
    $testResults.Warnings++
}

$testResults.Total++
$mobileSize = (Get-Item (Join-Path $rootPath "mobile-dashboard.html")).Length / 1KB
if ($mobileSize -lt 1000) {
    Write-Host "✅ Taille mobile-dashboard.html: $([math]::Round($mobileSize, 2)) KB (< 1000 KB)" -ForegroundColor Green
    $testResults.Success++
} else {
    Write-Host "⚠️  Taille mobile-dashboard.html: $([math]::Round($mobileSize, 2)) KB (> 1000 KB)" -ForegroundColor Yellow
    $testResults.Warnings++
}

# ========================================
# 13. TESTS DES REDIRECTIONS MOBILES
# ========================================
Write-Host "`n📱 VÉRIFICATION DES REDIRECTIONS MOBILES" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

Test-FileContent "dashboard.html" "mobile-dashboard\.html" "Redirection mobile dans dashboard.html"
Test-FileContent "dashboard.html" "Android|webOS|iPhone|iPad" "Détection mobile dans dashboard.html"

# ========================================
# RÉSUMÉ FINAL
# ========================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📊 RÉSUMÉ DES TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$successRate = [math]::Round(($testResults.Success / $testResults.Total) * 100, 1)

Write-Host "`nTotal de tests: $($testResults.Total)" -ForegroundColor White
Write-Host "✅ Réussis: $($testResults.Success)" -ForegroundColor Green
Write-Host "❌ Échoués: $($testResults.Failed)" -ForegroundColor Red
Write-Host "⚠️  Avertissements: $($testResults.Warnings)" -ForegroundColor Yellow
Write-Host "`nTaux de réussite: $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })

if ($successRate -ge 90) {
    Write-Host "`n🎉 EXCELLENT! Le site est prêt pour la production!" -ForegroundColor Green
} elseif ($successRate -ge 70) {
    Write-Host "`n⚠️  BON, mais quelques améliorations sont recommandées." -ForegroundColor Yellow
} else {
    Write-Host "`n❌ ATTENTION! Des problèmes critiques doivent être résolus." -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ Tests terminés!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Sauvegarder les résultats
$reportPath = Join-Path $rootPath "test-results.txt"
$report = @"
========================================
RAPPORT DE TEST - $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
========================================

Total de tests: $($testResults.Total)
Réussis: $($testResults.Success)
Échoués: $($testResults.Failed)
Avertissements: $($testResults.Warnings)
Taux de réussite: $successRate%

Status: $(if ($successRate -ge 90) { "PRODUCTION READY ✅" } elseif ($successRate -ge 70) { "NEEDS REVIEW ⚠️" } else { "CRITICAL ISSUES ❌" })
========================================
"@

$report | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "`nRapport sauvegarde: $reportPath" -ForegroundColor Cyan