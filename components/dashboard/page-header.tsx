export function PageHeader({
  title,
  text,
  children,
}: {
  title: string
  text?: string
  children?: React.ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl leading-[1.15] font-bold tracking-[-0.03em] text-white sm:text-4xl">
          {title}
        </h1>
        {text && <p className="max-w-2xl text-white/70">{text}</p>}
      </div>
      {children}
    </header>
  )
}
