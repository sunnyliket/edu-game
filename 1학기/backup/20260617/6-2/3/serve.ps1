# Simple HTTP Server for testing (PowerShell .NET HttpListener)
$prefix = "http://localhost:8080/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "HTTP Server started at $prefix"
Write-Host "Press Ctrl+C to stop."

$rootDir = "c:\Users\User\Desktop\phys2026-sci-project\6-2\3"

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.json' = 'application/json'
    '.ico'  = 'image/x-icon'
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }

        $filePath = Join-Path $rootDir ($localPath -replace '/', '\')

        # Security: ensure file is within root directory
        $resolvedPath = [System.IO.Path]::GetFullPath($filePath)
        if (-not $resolvedPath.StartsWith($rootDir)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $resolvedPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($resolvedPath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
            $response.ContentType = $contentType
            $response.Headers.Add("Access-Control-Allow-Origin", "*")

            $bytes = [System.IO.File]::ReadAllBytes($resolvedPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "$($request.HttpMethod) $localPath -> 200"
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
            Write-Host "$($request.HttpMethod) $localPath -> 404"
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
