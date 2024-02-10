import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState, ChangeEvent, FormEvent } from 'react'
import toast from 'react-hot-toast'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}


let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({onNoteCreated}: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleStartRecording() {
    setIsRecording(true)

    const isSpeechRecognitionAPIAvaliable ='SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

    if(!isSpeechRecognitionAPIAvaliable){
      alert('Infelizmente o seu navegador não suporta a API de gravação!')
      return
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      console.log(event.results)
    }

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)
   
    if(speechRecognition != null){
      speechRecognition.stop()
    }
    
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)

    if (event.target.value === '') {
      setShouldShowOnboarding(true)
    }

  }
  
  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if(content === ''){
      return
    }
    
    onNoteCreated(content)

    setContent('')
    setShouldShowOnboarding(true)
    toast.success("note created with sucess!")
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
          <span className='text-sm font-medium text-slate-500'>
            Add note
          </span>
          <p className='text-sm leading-6 text-slate-400'>
            Record one note in audio what will be converted to text automatically
          </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50' />
        <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60dvh] bg-slate-700 md:rounded-md flex flex-col outline-none' >
          <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100' >
            <X className='size-5' />
          </Dialog.Close>
          <form onSubmit={handleSaveNote} className='flex-1 flex flex-col'>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium  text-slate-200'>
                Add note
              </span>
              {shouldShowOnboarding ? (
                <p className='text-sm leading-6 text-slate-400'>
                start <button onClick={handleStartRecording} className='text-lime-400 font-medium hover:underline'>recording your note</button> in audio or if you prefer <button onClick={handleStartEditor} className='text-lime-400 font-medium hover:underline'>just type</button>
              </p>) : (
              <p>
                <textarea
                  autoFocus
                  className='text-m leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                  onChange={handleContentChanged}
                  value={content}
                >
                  
                </textarea>
              </p>
              )
              }
            </div>

            {isRecording ? (
              <button 
                type='button' 
                onClick={handleStopRecording}
                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-350 outline-none font-medium group hover:text-slate-100'
                >
                <div className='size-3 rounded-full bg-red-500 animate-bounce'/>
                Recording! (clique p/ interromper)
              </button>
            ) : (
              <button 
                  type='button' 
                  onClick={handleSaveNote}
                  className='w-full bg-lime-400 py-4 text-center text-sm text-slate-950 outline-none font-medium group '
                  >
                  Save note
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}