import './globals.css'

export const metadata = {
  title: 'JUNKED STUDIO | One-of-One Phone Cases',
  description: 'Handmade junked phone cases. One of one.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-cream text-on-surface font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
