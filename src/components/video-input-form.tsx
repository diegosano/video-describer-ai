'use client'

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import { FileVideo, Upload } from 'lucide-react'
import { fetchFile } from '@ffmpeg/util'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getFFmpeg } from '@/lib/ffmpeg'
import { api } from '@/lib/axios'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
  converting: 'Convertendo...',
  generating: 'Transcrevendo...',
  uploading: 'Carregando...',
  success: 'Sucesso',
}

interface VideoInputFormProps {
  onVideoUpload: (videoId: string) => void
}

export function VideoInputForm({ onVideoUpload }: VideoInputFormProps) {
  const [status, setStatus] = useState<Status>('waiting')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  async function convertVideoToAudio(video: File) {
    console.log('convert started')

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('log', console.log)
    ffmpeg.on('progress', (progress) =>
      console.log(`Convert progress: ${Math.round(progress.progress * 100)}`),
    )

    ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    })

    console.log('convert finish')

    return audioFile
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) {
      return
    }

    const selectedFile = files[0]

    setVideoFile(selectedFile)
    setStatus('waiting')
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!promptInputRef.current || !videoFile) {
      return
    }

    try {
      const prompt = promptInputRef.current.value

      setStatus('converting')

      const audioFile = await convertVideoToAudio(videoFile)

      const data = new FormData()

      data.append('file', audioFile)

      setStatus('uploading')

      const response = await api.post('/videos', data)

      const videoId = response.data.video.id

      setStatus('generating')

      await api.post('/videos/transcription', {
        videoId,
        prompt,
      })

      setStatus('success')
      onVideoUpload(videoId)
    } catch (error) {
      console.log(error)
      setStatus('waiting')
    }
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form onSubmit={handleUploadVideo} className="space-y-6">
      <label
        htmlFor="video"
        className="relative flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0 object-contain"
          />
        ) : (
          <>
            <FileVideo className="h-4 w-4" />
            Selecione um vídeo
          </>
        )}
      </label>

      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>

        <Textarea
          id="transcription_prompt"
          className="h-20 resize-none leading-relaxed"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
          ref={promptInputRef}
          disabled={status !== 'waiting'}
        />

        <Button
          data-success={status === 'success'}
          disabled={status !== 'waiting'}
          type="submit"
          className="w-full data-[success=true]:bg-emerald-600"
        >
          {status === 'waiting' ? (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Carregar vídeo
            </>
          ) : (
            statusMessages[status]
          )}
        </Button>
      </div>
    </form>
  )
}
