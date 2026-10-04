$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$packageData = Get-Content -LiteralPath (Join-Path $projectRoot 'package.json') -Raw | ConvertFrom-Json
$extensionPath = Join-Path $projectRoot 'dist\tweet-cleaner'
$zipPath = Join-Path $projectRoot ("dist\tweet-cleaner-" + $packageData.version + ".zip")
Compress-Archive -Path (Join-Path $extensionPath '*') -DestinationPath $zipPath -Force
Write-Output $zipPath
