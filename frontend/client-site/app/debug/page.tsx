"use client"
import { useState, useEffect } from 'react'
import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const { getToken, isLoaded, userId } = useAuth()
  const { user } = useUser()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [testResults, setTestResults] = useState<string[]>([])

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  const testAuthentication = async () => {
    addLog("🧪 Starting authentication test...")
    
    // Test 1: Check Clerk status
    addLog(`📋 isLoaded: ${isLoaded}`)
    addLog(`👤 userId: ${userId}`)
    addLog(`📧 user email: ${user?.emailAddresses[0]?.emailAddress}`)
    
    // Test 2: Get token
    try {
      const token = await getToken()
      addLog(`🎫 Token: ${token ? `${token.substring(0, 20)}...` : 'null'}`)
      
      if (token) {
        // Test 3: Test backend API directly
        addLog("📡 Testing backend API...")
        
        const response = await fetch('http://localhost:5000/api/jobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        })
        
        addLog(`📊 Response status: ${response.status}`)
        
        if (response.ok) {
          const data = await response.json()
          addLog(`✅ Jobs received: ${data.length} jobs`)
          addLog(`📝 First job: ${JSON.stringify(data[0], null, 2)}`)
        } else {
          const errorText = await response.text()
          addLog(`❌ Error response: ${errorText}`)
        }
      }
    } catch (error) {
      addLog(`❌ Error: ${error}`)
    }
  }

  useEffect(() => {
    setDebugInfo({
      isLoaded,
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress,
      timestamp: new Date().toISOString()
    })
  }, [isLoaded, userId, user])

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Current Status:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          
          <Button onClick={testAuthentication}>
            Run Authentication Test
          </Button>
          
          <div>
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="bg-gray-100 p-3 rounded text-sm max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">{result}</div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
