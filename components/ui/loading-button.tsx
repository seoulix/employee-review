"use client"
import React from 'react'
import { useButtonLoading } from '@/hooks/useButtonLoading'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => Promise<any>
  loadingMessage?: string
  successMessage?: string
  errorMessage?: string
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  loadingMessage = 'Processing...',
  successMessage = 'Success!',
  errorMessage = 'Something went wrong',
  children,
  variant = 'default',
  size = 'default',
  className,
  disabled,
  ...props
}) => {
  const { handleButtonClick } = useButtonLoading({
    loadingMessage,
    successMessage,
    errorMessage
  })

  const handleClick = async () => {
    await handleButtonClick(onClick, loadingMessage, successMessage, errorMessage)
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  )
}

// Simple Loading Button (shows loading state without toast)
export const SimpleLoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  children,
  variant = 'default',
  size = 'default',
  className,
  disabled,
  ...props
}) => {
  const { showLoading, hideLoading } = useButtonLoading()

  const handleClick = async () => {
    try {
      showLoading('Processing...')
      await onClick()
    } catch (error) {
      console.error('Button action failed:', error)
    } finally {
      hideLoading()
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  )
} 