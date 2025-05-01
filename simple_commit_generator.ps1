# Simple GitHub Commit Generator
# Picks random functions from a pool and adds them to files

# Pool of utility functions to add
$functionPool = @(
    @"
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
"@,
    @"
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}
"@,
    @"
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}
"@,
    @"
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
"@,
    @"
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
"@,
    @"
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
"@,
    @"
function isValidPhoneNumber(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
}
"@,
    @"
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
"@,
    @"
function calculateTax(amount, taxRate = 0.08) {
    return amount * taxRate;
}
"@,
    @"
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}
"@
)

# Files to add functions to
$targetFiles = @(
    "backend/utils/helpers.js",
    "backend/utils/validators.js",
    "FoodyFrontend/foody-feast-find/src/utils/helpers.js",
    "FoodyFrontend/foody-feast-find/src/utils/formatters.js"
)

# Commit messages
$commitMessages = @(
    "Add utility function for better code reusability",
    "Implement helper function for improved functionality",
    "Add validation function for enhanced security",
    "Include formatter function for better UX",
    "Add utility function for code optimization",
    "Implement helper for improved error handling",
    "Add function for better data processing",
    "Include utility for enhanced performance",
    "Add helper function for code maintainability",
    "Implement function for better user experience"
)

function Get-RandomTime {
    $hour = Get-Random -Minimum 9 -Maximum 18
    $minute = Get-Random -Minimum 0 -Maximum 60
    $second = Get-Random -Minimum 0 -Maximum 60
    return "{0:D2}:{1:D2}:{2:D2}" -f $hour, $minute, $second
}

function Add-FunctionToFile {
    param([string]$Date)
    
    # Pick random function and file
    $randomFunction = $functionPool | Get-Random
    $randomFile = $targetFiles | Get-Random
    
    # Create directory if it doesn't exist
    $directory = Split-Path $randomFile -Parent
    if (-not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }
    
    # Add function to file
    if (Test-Path $randomFile) {
        $content = Get-Content $randomFile -Raw
        $newContent = $content + "`n`n// Added $Date`n" + $randomFunction
    } else {
        $newContent = "// Utility functions - Created $Date`n" + $randomFunction
    }
    
    Set-Content -Path $randomFile -Value $newContent
    return $true
}

# Main execution
Write-Host "Starting Simple Commit Generator..." -ForegroundColor Green
Write-Host "Date Range: May 1st to June 28th, 2025" -ForegroundColor Yellow

# Initialize git if needed
if (-not (Test-Path ".git")) {
    git init
    git add .
    git commit -m "Initial commit" --date="2025-05-01T10:00:00+05:30"
}

$startDate = Get-Date "2025-05-01"
$endDate = Get-Date "2025-06-28"
$currentDate = $startDate
$totalCommits = 0

while ($currentDate -le $endDate) {
    $dayOfWeek = $currentDate.DayOfWeek
    
    # Skip some weekends
    if (($dayOfWeek -eq "Saturday" -or $dayOfWeek -eq "Sunday") -and (Get-Random -Minimum 1 -Maximum 3) -eq 1) {
        Write-Host "Skipped: $($currentDate.ToString('yyyy-MM-dd'))" -ForegroundColor Gray
        $currentDate = $currentDate.AddDays(1)
        continue
    }
    
    # Random number of commits (1-3)
    $commitCount = Get-Random -Minimum 1 -Maximum 4
    
    for ($i = 1; $i -le $commitCount; $i++) {
        $dateString = $currentDate.ToString("yyyy-MM-dd")
        $time = Get-RandomTime
        $fullDateTime = "$dateString`T$time+05:30"
        $message = $commitMessages | Get-Random
        
        # Set git date environment variables
        $env:GIT_COMMITTER_DATE = $fullDateTime
        $env:GIT_AUTHOR_DATE = $fullDateTime
        
        # Add function to random file
        Add-FunctionToFile -Date $dateString
        
        # Commit
        git add .
        git commit -m "$message - $dateString" --date=$fullDateTime
        
        $totalCommits++
        Write-Host "Commit $totalCommits`: $message - $dateString" -ForegroundColor Green
        
        Start-Sleep -Milliseconds 100
    }
    
    $currentDate = $currentDate.AddDays(1)
}

Write-Host "`nCompleted! Created $totalCommits commits" -ForegroundColor Cyan
Write-Host "Push to GitHub to see your green heatmap!" -ForegroundColor Green
