'use client'

import { useState } from 'react'
import { useCompletion } from 'ai/react'
import { Github, Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ThemeToggle } from '@/components/theme-toggle'
import { VideoInputForm } from '@/components/video-input-form'
import { PromptSelect } from '@/components/prompt-select'

export default function Home() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>(null)

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: `${process.env.NEXT_PUBLIC_APP_URL}/api/videos/generate`,
    body: {
      videoId,
      temperature,
    },
  })

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-xl font-bold">videodescriber.ai</h1>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button variant="outline" size="icon" asChild>
            <a
              href="https://github.com/diegosano/video-describer-ai"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              <Github className="h-4 w-4 " />
              <span className="sr-only">Link do repositório no GitHub</span>
            </a>
          </Button>
        </div>
      </div>

      <main className="flex  flex-1 gap-6 p-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid flex-1 grid-rows-2 gap-4">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Inclua o prompt para a IA"
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Resultado gerado pela IA"
              value={completion}
              readOnly
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável{' '}
            <code className="text-primary">{'{transcription}'}</code> no seu
            prompt para adicionar o conteúdo da transcrição do vídeo
            selecionado.
          </p>
        </div>

        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUpload={setVideoId} />

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>

              <PromptSelect onPromptSelect={setInput} />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>

              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>

              <span className="block text-xs italic text-muted-foreground">
                Você poderá customizar essa opção em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>

              <Slider
                min={0}
                max={1}
                step={0.1}
                defaultValue={[0.5]}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />

              <span className="block text-xs italic leading-relaxed text-muted-foreground">
                Valores mais altos tendem a deixar o resultado mais criativo,
                porém com possíveis erros
              </span>
            </div>

            <Separator />

            <Button
              disabled={isLoading || !videoId}
              type="submit"
              className="w-full"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Executar
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}
