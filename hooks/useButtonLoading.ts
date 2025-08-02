import { useLoading } from '@/contexts/LoadingContext'

interface UseButtonLoadingOptions {
  loadingMessage?: string
  successMessage?: string
  errorMessage?: string
}

export const useButtonLoading = (options: UseButtonLoadingOptions = {}) => {
  const { showLoading, hideLoading, showToast } = useLoading()
  
  const {
    loadingMessage = 'Processing...',
    successMessage = 'Success!',
    errorMessage = 'Something went wrong'
  } = options

  const handleButtonClick = async (
    action: () => Promise<any>,
    customLoadingMessage?: string,
    customSuccessMessage?: string,
    customErrorMessage?: string
  ) => {
    try {
      showLoading(customLoadingMessage || loadingMessage)
      await action()
      hideLoading()
      showToast(customSuccessMessage || successMessage, 'success')
    } catch (error) {
      hideLoading()
      showToast(customErrorMessage || errorMessage, 'error')
      console.error('Button action failed:', error)
    }
  }

  return {
    handleButtonClick,
    showLoading,
    hideLoading,
    showToast
  }
} 