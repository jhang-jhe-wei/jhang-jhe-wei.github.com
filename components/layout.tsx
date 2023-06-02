import Nav from './nav/nav'

export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav/>
      {children}
    </>
  )
}
