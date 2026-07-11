import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { UploadCloud, File as FileIcon, Download, Trash2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'
import { skipCloud, SKIP_CLOUD_ENABLED } from '@/lib/skip-cloud'
import { Opportunity } from '@/lib/types'

export function FileUploader({ opp }: { opp: Opportunity }) {
  const { uploadFiles, deleteFile } = useMainStore()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [deletingFile, setDeletingFile] = useState<string | null>(null)

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const pdfFiles = Array.from(files).filter(
      (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'),
    )
    if (pdfFiles.length === 0) {
      toast({
        title: 'Formato inválido',
        description: 'Apenas arquivos PDF são aceitos.',
        variant: 'destructive',
      })
      return
    }
    setIsUploading(true)
    try {
      await uploadFiles(opp.id, pdfFiles)
      toast({
        title: 'Arquivos enviados!',
        description: `${pdfFiles.length} arquivo(s) anexado(s).`,
      })
    } catch (e: unknown) {
      toast({
        title: 'Erro',
        description: e instanceof Error ? e.message : 'Falha no upload.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (filename: string) => {
    setDeletingFile(filename)
    try {
      await deleteFile(opp.id, filename)
      toast({ title: 'Arquivo removido.' })
    } catch {
      toast({ title: 'Erro', description: 'Falha ao remover arquivo.', variant: 'destructive' })
    } finally {
      setDeletingFile(null)
    }
  }

  const files = opp.files || []

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-slate-400 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleUpload(e.dataTransfer.files)
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="mx-auto h-8 w-8 text-[#2563EB] animate-spin mb-2" />
        ) : (
          <UploadCloud className="mx-auto h-8 w-8 text-slate-400 mb-2" />
        )}
        <p className="text-sm text-slate-600 font-medium">
          {isUploading ? 'Enviando...' : 'Anexar documentos PDF'}
        </p>
        <p className="text-xs text-slate-400 mt-1">Clique ou arraste arquivos</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((filename, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileIcon className="h-5 w-5 text-rose-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700 truncate">{filename}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {SKIP_CLOUD_ENABLED && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <a
                      href={skipCloud.getFileUrl('opportunities', opp.id, filename)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 text-slate-500" />
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-rose-600"
                  onClick={() => handleDelete(filename)}
                  disabled={deletingFile === filename}
                >
                  {deletingFile === filename ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && !isUploading && (
        <p className="text-xs text-slate-400 text-center italic">Nenhum documento anexado ainda.</p>
      )}
    </div>
  )
}
