$ErrorActionPreference = 'SilentlyContinue'
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
  Select-Object ProcessId, CommandLine |
  Where-Object { $_.CommandLine -match 'Google.Chrome' } |
  ForEach-Object { "{0} :: {1}" -f $_.ProcessId, $_.CommandLine }
