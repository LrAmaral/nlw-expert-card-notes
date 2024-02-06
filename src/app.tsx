import logo from './assets/Logo.svg'
import { NoteCard } from './components/note-card'

export function App() {
 return (
    <div className="mx-auto max-w-6xl my-10 space-y-6">
      <img src={logo} alt="nlw-expert" />

      <form action="w-full">
        <input 
          type="text" 
          placeholder='Busque suas notas' 
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          />  
      </form>     

      <div className='h-px bg-slate-700'/>

      <div className='grid grid-cols-3  gap-6 auto-rows-[258px] overflow-hidden relative'>

        <div className='rounded-md p-5 bg-slate-700 space-y-3'>
          <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
          <p className='text-sm leading-6 text-slate-400'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
        </div>

        <NoteCard />
        <NoteCard />
        <NoteCard />
      </div> 
    </div>
  )
}