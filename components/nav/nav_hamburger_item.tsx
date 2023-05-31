export default function NavHamburger ({ reveal, setReveal }: {reveal: boolean, setReveal: Function}) {
  return (
    <div className="flex flex-col justify-between h-6 ml-6 xl:hidden" onClick={() => setReveal((reveal: boolean) => reveal = !reveal)}>
      <span className={`block w-8 h-1 transition-all duration-500 ${reveal ? '-rotate-45 translate-y-2.5 bg-light' : 'bg-primary dark:bg-light'}`}></span>
      <span className={`block w-8 h-1 bg-primary dark:bg-light transition-all duration-500 ${reveal ? 'hidden' : ''}`}></span>
      <span className={`block w-8 h-1 transition-all duration-500 ${reveal ? 'rotate-45 -translate-y-2.5 bg-light' : 'bg-primary dark:bg-light'}`}></span>
    </div>
  )
}
