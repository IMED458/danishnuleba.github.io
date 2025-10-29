import React from 'react'

export default function Header({ logoUrl, setLogoUrl, clinicName }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={logoUrl}
        alt="logo"
        className="h-20 w-20 object-contain"
        onError={(e) => { e.target.src = '/logo-placeholder.svg' }}
      />
      <h1 className="text-center text-lg font-semibold">{clinicName}</h1>
    </div>
  )
}
