$ErrorActionPreference = 'SilentlyContinue'
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
  Where-Object { $_.CommandLine -match 'headless' } |
  Select-Object ProcessId, CommandLine |
  ForEach-Object { "{0} :: {1}" -f $_.ProcessId, $_.CommandLine }
