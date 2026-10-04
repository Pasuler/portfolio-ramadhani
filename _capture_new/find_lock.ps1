$ErrorActionPreference = 'SilentlyContinue'
Get-CimInstance Win32_Process -Filter "Name='chrome.exe' OR Name='node.exe'" |
  Select-Object ProcessId, Name, CommandLine |
  Where-Object { $_.CommandLine -match 'headless|puppeteer|portofolio|convert_svg|test_' } |
  Format-List ProcessId, Name, CommandLine
