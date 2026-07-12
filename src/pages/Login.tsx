import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { SKIP_CLOUD_ENABLED } from '@/lib/skip-cloud'

export default function Login() {
  const navigate = useNavigate()
  const { login, user } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha no login. Verifique suas credenciais.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="bg-primary text-primary-foreground p-3 rounded-xl">
              <ShieldCheck size={32} />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Hebron Consultorias</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Sistema de Análise de Licitações</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          {!SKIP_CLOUD_ENABLED && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 text-center">
              ⚠️ Modo Demo: Backend não conectado. Use qualquer e-mail e senha para entrar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
