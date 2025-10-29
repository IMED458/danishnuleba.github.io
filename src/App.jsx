import React, { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Editor from './components/Editor'
import TemplatesPanel from './components/TemplatesPanel'

const DOCTORS = [
  'ნინო კიკვაძე',
  'ანა დალაქიშვილი',
  'თეკლა მაისურაძე',
  'მურად მიგინეიშვილი',
  'ქეთევან ზედელაშვილი',
  'ტერეზა ოსადჩუკ',
  'ეკატერინე მიქელაძე'
]

export default function App() {
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem('zweck:logo') || '/logo-placeholder.svg')
  const [clinicName] = useState('თბილისის სახელმწიფო სამედიცინო უნივერსტეტის და ინგოროყვას მაღალი სამედიცინო ტექნოლოგიების საუნივერსიტეტო კლინიკა')
  const [patientName, setPatientName] = useState('')
  const [historyNumber, setHistoryNumber] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [doctor, setDoctor] = useState(DOCTORS[0])
  const editorRef = useRef()

  useEffect(() => {
    localStorage.setItem('zweck:logo', logoUrl)
  }, [logoUrl])

  function handlePrint() {
    const html = editorRef.current?.getPrintHtml({
      patientName, historyNumber, date, doctor, logoUrl, clinicName
    })
    const w = window.open('', '_blank', 'noopener')
    if (!w) return alert('Pop-up blocked. Allow pop-ups or use the print button in your browser.')
    w.document.write(html)
    w.document.close()
    setTimeout(() => w.print(), 300)
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 p-6">
      <div className="max-w-5xl mx-auto">
        <Header logoUrl={logoUrl} setLogoUrl={setLogoUrl} clinicName={clinicName} />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-5 shadow rounded">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-sm">პაციენტი — სახელი და გვარი</label>
                <input value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="ანზორ ბერიძე" className="mt-1 block w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-sm">ისტორიის ნომერი</label>
                <input value={historyNumber} onChange={e => setHistoryNumber(e.target.value)} placeholder="123456" className="mt-1 block w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-sm">თარიღი</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border rounded px-2 py-1" />
              </div>
            </div>
            <div className="mt-4">
              <Editor ref={editorRef} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <label className="block text-sm">ექიმი</label>
                <select value={doctor} onChange={e => setDoctor(e.target.value)} className="mt-1 border rounded px-2 py-1">
                  {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handlePrint} className="px-4 py-2 rounded shadow bg-sky-600 text-white">ბეჭდვა</button>
                <button
                  onClick={() => editorRef.current?.clear()}
                  className="px-4 py-2 rounded border"
                >
                  გასუფთავება
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <TemplatesPanel editorRef={editorRef} />
            <div className="bg-white p-4 shadow rounded">
              <h3 className="font-semibold mb-2">პარამეტრები</h3>
              <label className="block text-sm">ლოგოს URL</label>
              <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://.../logo.svg" className="mt-1 block w-full border rounded px-2 py-1" />
              <p className="text-xs text-slate-500 mt-2">თუ გაქვთ ლოკალური SVG, ატვირთეთ და დატოვეთ URL აქ.</p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <h3 className="font-semibold mb-2">მინიმალური შენახვა</h3>
              <p className="text-sm text-slate-600">შაბლონები შენახულია LocalStorage-ში. შეგიძლიათ ექსპორტი/იმპორტი მომავალში დაამატოთ.</p>
            </div>
          </div>
        </div>
        <footer className="mt-8 text-center text-xs text-slate-500">Zweck — prototype • შექმნილია GitHub-ზე განთავსებისთვის</footer>
      </div>
    </div>
  )
}
