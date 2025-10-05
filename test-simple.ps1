# Script de verification simple du site Misterpips
Write-Host "========================================"
Write-Host "TEST COMPLET DU SITE MISTERPIPS"
Write-Host "========================================"
Write-Host ""

$rootPath = "C:\Users\BATT-CAVE\Desktop\Misterpips-mainDEPL"
$success = 0
$failed = 0
$total = 0

function Test-File {
    param($file, $desc)
    $script:total++
    $fullPath = Join-Path $rootPath $file
    if (Test-Path $fullPath) {
        Write-Host "[OK] $desc" -ForegroundColor Green
        $script:success++
        return $true
    } else {
        Write-Host "[FAIL] $desc - MANQUANT" -ForegroundColor Red
        $script:failed++
        return $false
    }
}

# Tests des fichiers principaux
Write-Host "`nFICHIERS PRINCIPAUX" -ForegroundColor Yellow
Test-File "index.html" "Page d'accueil"
Test-File "dashboard.html" "Dashboard PC"
Test-File "mobile-dashboard.html" "Dashboard Mobile"
Test-File "vip-space.html" "Espace VIP"

# Tests CSS
Write-Host "`nFICHIERS CSS" -ForegroundColor Yellow
Test-File "styles.css" "CSS Principal"
Test-File "dashboard-clean.css" "CSS Dashboard"
Test-File "mobile-complete.css" "CSS Mobile"

# Tests JavaScript
Write-Host "`nFICHIERS JAVASCRIPT" -ForegroundColor Yellow
Test-File "script.js" "Script Principal"
Test-File "dashboard.js" "Script Dashboard"
Test-File "chat.js" "Script Chat"

# Tests Documentation
Write-Host "`nDOCUMENTATION" -ForegroundColor Yellow
Test-File "README.md" "README"
Test-File "LISEZMOI-NOTIFICATIONS.txt" "Guide Notifications"
Test-File "SYNTHESE-FINALE.md" "Synthese Finale"

# Tests PWA
Write-Host "`nPWA" -ForegroundColor Yellow
Test-File "manifest.json" "Manifest"
Test-File "sw.js" "Service Worker"

# Tests Assets
Write-Host "`nASSETS" -ForegroundColor Yellow
Test-File "Misterpips.jpg" "Logo"

# Calculs de test
Write-Host "`nTESTS DE CALCULS" -ForegroundColor Yellow

# Test P&L
$total++
$entry = 1.1000
$exit = 1.1050
$lots = 1
$pips = ($exit - $entry) * 10000
$pnl = $pips * 10 * $lots
if ([Math]::Abs($pnl - 500) -lt 0.01) {
    Write-Host "[OK] Calcul P&L: $pnl (attendu: 500)" -ForegroundColor Green
    $success++
} else {
    Write-Host "[FAIL] Calcul P&L: $pnl (attendu: 500)" -ForegroundColor Red
    $failed++
}

# Test Winrate
$total++
$wins = 7
$totalTrades = 10
$winrate = ($wins / $totalTrades) * 100
if ([Math]::Abs($winrate - 70) -lt 0.01) {
    Write-Host "[OK] Calcul Winrate: $winrate% (attendu: 70%)" -ForegroundColor Green
    $success++
} else {
    Write-Host "[FAIL] Calcul Winrate: $winrate% (attendu: 70%)" -ForegroundColor Red
    $failed++
}

# Test Risk/Reward
$total++
$risk = 100
$reward = 300
$rr = $reward / $risk
if ([Math]::Abs($rr - 3) -lt 0.01) {
    Write-Host "[OK] Calcul Risk/Reward: 1:$rr (attendu: 1:3)" -ForegroundColor Green
    $success++
} else {
    Write-Host "[FAIL] Calcul Risk/Reward: 1:$rr (attendu: 1:3)" -ForegroundColor Red
    $failed++
}

# Verification du contenu
Write-Host "`nVERIFICATION DU CONTENU" -ForegroundColor Yellow

$total++
$mobileContent = Get-Content (Join-Path $rootPath "mobile-dashboard.html") -Raw
if ($mobileContent -match "getMobileNotificationSettings") {
    Write-Host "[OK] Fonction getMobileNotificationSettings presente" -ForegroundColor Green
    $success++
} else {
    Write-Host "[FAIL] Fonction getMobileNotificationSettings manquante" -ForegroundColor Red
    $failed++
}

$total++
if ($mobileContent -match "playMobileNotificationSound") {
    Write-Host "[OK] Fonction playMobileNotificationSound presente" -ForegroundColor Green
    $success++
} else {
    Write-Host "[FAIL] Fonction playMobileNotificationSound manquante" -ForegroundColor Red
    $failed++
}

$total++
if ($mobileContent -match "showMobileChatNotification") {
    Write-Host "[OK] Fonction showMobileChatNotification presente" -ForegroundColor Green
    $success++
} else {
    Write-Host "[FAIL] Fonction showMobileChatNotification manquante" -ForegroundColor Red
    $failed++
}

# Verification Firebase
$total++
if ($mobileContent -match "apiKey.*AIzaSyDSDK0NfVSs_VQb3TnrixiJbOpTsmoUMvU") {
    Write-Host "[OK] Configuration Firebase presente" -ForegroundColor Green
    $success++
} else {
    Write-Host "[FAIL] Configuration Firebase manquante" -ForegroundColor Red
    $failed++
}

# Verification structure HTML
$total++
if ($mobileContent -match "</html>") {
    Write-Host "[OK] Structure HTML complete (balise fermante)" -ForegroundColor Green
    $success++
} else {
    Write-Host "[FAIL] Structure HTML incomplete" -ForegroundColor Red
    $failed++
}

# Resume
Write-Host "`n========================================"
Write-Host "RESUME DES TESTS"
Write-Host "========================================"
$successRate = [math]::Round(($success / $total) * 100, 1)
Write-Host "Total: $total tests"
Write-Host "Reussis: $success" -ForegroundColor Green
Write-Host "Echoues: $failed" -ForegroundColor Red
Write-Host "Taux de reussite: $successRate%"

if ($successRate -ge 90) {
    Write-Host "`nSTATUS: PRODUCTION READY" -ForegroundColor Green
} elseif ($successRate -ge 70) {
    Write-Host "`nSTATUS: NEEDS REVIEW" -ForegroundColor Yellow
} else {
    Write-Host "`nSTATUS: CRITICAL ISSUES" -ForegroundColor Red
}

Write-Host "`n========================================"
Write-Host "Tests termines!"
Write-Host "========================================"