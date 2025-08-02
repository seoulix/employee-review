"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LoadingContextType {
  isLoading: boolean
  loadingMessage: string
  showLoading: (message?: string) => void
  hideLoading: () => void
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
  toast: ToastType | null
}

interface ToastType {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  timestamp: number
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: ReactNode
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [toast, setToast] = useState<ToastType | null>(null)

  const showLoading = (message: string = 'Loading...') => {
    console.log('🔄 Showing loading:', message)
    setLoadingMessage(message)
    setIsLoading(true)
  }

  const hideLoading = () => {
    console.log('✅ Hiding loading')
    setIsLoading(false)
    setLoadingMessage('')
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    console.log('🍞 Showing toast:', message, type)
    const newToast: ToastType = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now()
    }
    
    setToast(newToast)
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  const value: LoadingContextType = {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    showToast,
    toast
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay />
      <ToastNotification />
    </LoadingContext.Provider>
  )
}

// Loading Overlay Component
const LoadingOverlay: React.FC = () => {
  const context = useContext(LoadingContext)
  const isLoading = context?.isLoading || false
  const loadingMessage = context?.loadingMessage || ''

  console.log('🎭 LoadingOverlay render:', { isLoading, loadingMessage })

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm mx-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div>
            <p className="text-gray-900 dark:text-white font-medium">{loadingMessage}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Please wait...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Toast Notification Component
const ToastNotification: React.FC = () => {
  const context = useContext(LoadingContext)
  const toast = context?.toast || null

  console.log('🍞 ToastNotification render:', toast)

  if (!toast) return null

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600'
      case 'error':
        return 'bg-red-500 text-white border-red-600'
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600'
      case 'info':
      default:
        return 'bg-blue-500 text-white border-blue-600'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
      default:
        return 'ℹ'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
      <div className={`${getToastStyles(toast.type)} rounded-lg shadow-lg border p-4 max-w-sm`}>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getIcon(toast.type)}</span>
          <p className="font-medium">{toast.message}</p>
        </div>
      </div>
    </div>
  )
} 