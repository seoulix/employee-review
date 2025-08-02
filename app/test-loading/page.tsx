"use client"
import { useLoading } from "@/contexts/LoadingContext"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestLoadingPage() {
  const { showLoading, hideLoading, showToast } = useLoading()

  const testLoading = async () => {
    showLoading("Testing loading...")
    await new Promise(resolve => setTimeout(resolve, 2000))
    hideLoading()
    showToast("Loading test completed!", "success")
  }

  const testError = async () => {
    showLoading("Testing error...")
    await new Promise(resolve => setTimeout(resolve, 1500))
    hideLoading()
    showToast("This is a test error!", "error")
  }

  const testWarning = async () => {
    showLoading("Testing warning...")
    await new Promise(resolve => setTimeout(resolve, 1000))
    hideLoading()
    showToast("This is a warning message!", "warning")
  }

  const testInfo = async () => {
    showLoading("Testing info...")
    await new Promise(resolve => setTimeout(resolve, 800))
    hideLoading()
    showToast("This is an info message!", "info")
  }

  const testLoadingButton = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return "Success!"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Loading System Test Page</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Direct Context Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testLoading} className="w-full">
                Test Loading (2s)
              </Button>
              <Button onClick={testError} variant="destructive" className="w-full">
                Test Error Toast
              </Button>
              <Button onClick={testWarning} variant="outline" className="w-full">
                Test Warning Toast
              </Button>
              <Button onClick={testInfo} variant="secondary" className="w-full">
                Test Info Toast
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>LoadingButton Component</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LoadingButton 
                onClick={testLoadingButton}
                loadingMessage="Processing with LoadingButton..."
                successMessage="LoadingButton test completed!"
                errorMessage="LoadingButton test failed!"
                className="w-full"
              >
                Test LoadingButton
              </LoadingButton>
              
              <LoadingButton 
                onClick={async () => {
                  await new Promise(resolve => setTimeout(resolve, 1500))
                  throw new Error("Test error")
                }}
                loadingMessage="Testing error handling..."
                successMessage="This won't show"
                errorMessage="Error handled correctly!"
                variant="destructive"
                className="w-full"
              >
                Test Error Handling
              </LoadingButton>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold">1. Direct Context Usage:</h3>
                <pre className="bg-gray-100 p-2 rounded mt-1">
{`const { showLoading, hideLoading, showToast } = useLoading()

const handleClick = async () => {
  showLoading("Processing...")
  try {
    await someAsyncOperation()
    showToast("Success!", "success")
  } catch (error) {
    showToast("Error!", "error")
  } finally {
    hideLoading()
  }
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold">2. LoadingButton Component:</h3>
                <pre className="bg-gray-100 p-2 rounded mt-1">
{`<LoadingButton 
  onClick={async () => await someAsyncOperation()}
  loadingMessage="Processing..."
  successMessage="Success!"
  errorMessage="Error!"
>
  Click Me
</LoadingButton>`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold">3. Toast Types:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>success</code> - Green with ✓ icon</li>
                  <li><code>error</code> - Red with ✕ icon</li>
                  <li><code>warning</code> - Yellow with ⚠ icon</li>
                  <li><code>info</code> - Blue with ℹ icon</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 