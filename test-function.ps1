$body = @{
    code = "test-code-12345"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c3FpeWpmcXZkcHRqbnhlZmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDU5NTYsImV4cCI6MjA3NTYyMTk1Nn0.uc-wEsnkKtZjscmmJUIJ64qZJXGHQpp8cYwjEhWBivo"
}

Write-Host "Testing function..."
$response = Invoke-WebRequest -Uri "https://cvsqiyjfqvdptjnxefbk.supabase.co/functions/v1/supabase-oauth-exchange" -Method POST -Headers $headers -Body $body -UseBasicParsing

Write-Host "Status Code:" $response.StatusCode
Write-Host "Response:"
$response.Content
