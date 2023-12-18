import { AuthProvider } from 'app/components/localStorge'
import { SafeArea } from './safe-area'

export function Provider({ children }: { children: React.ReactNode }) {
  return <SafeArea>
    <AuthProvider>
      {children}
    </AuthProvider>
  </SafeArea>
}
