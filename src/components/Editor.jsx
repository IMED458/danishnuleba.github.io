import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react'

const Editor = forwardRef((props, ref) => {
  const editableRef = useRef(null)
  const [html, setHtml] = useState('<p>დასაწყისი...</p>')

  useEffect(() => {
    if (editableRef.current && editableRef.current.innerHTML !== html) {
      editableRef.current.innerHTML = html
    }
  }, [html])

  useImperativeHandle(ref, () => ({
    getHtml: () => editableRef.current?.innerHTML || '',
    setHtml: (newHtml) => setHtml(newHtml),
    clear: () => setHtml(''),
    getPrintHtml: ({ patientName, historyNumber, date, doctor, logoUrl, clinicName }) => {
      const content = editableRef.current?.innerHTML || html
      return `
        <!DOCTYPE html>
        <html lang="ka">
        <head>
          <meta charset="utf-8" />
          <title>დანიშვნა</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #111; line-height: 1.6; }
            .header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
            .logo img { height: 80px; }
            .clinic { font-weight: 700; font-size: 1.1em; }
            .meta { font-size: 0.95em; color: #444; }
            .content { margin: 25px 0; }
            .footer { margin-top: 40px; font-size: 0.95em; }
            @media print { body { padding: 15px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo"><img src="${logoUrl}" onerror="this.src='/logo-placeholder.svg'" /></div>
            <div>
              <div class="clinic">${clinicName}</div>
              <div class="meta">
                პაციენტი: ${patientName || '__________'} • 
                ისტორიის №: ${historyNumber || '________'} • 
                თარიღი: ${date}
              </div>
            </div>
          </div>
          <div class="content">${content}</div>
          <div class="footer">ექიმი: <strong>${doctor}</strong></div>
        </body>
        </html>
      `
    }
  }))

  function exec(cmd, value = null) {
    document.execCommand(cmd, false, value)
    if (editableRef.current) {
      setHtml(editableRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    if (editableRef.current) {
      setHtml(editableRef.current.innerHTML)
    }
  }

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-3">
        <button type="button" onClick={() => exec('undo')} className="px-2 py-1 border rounded text-sm">↶ Undo</button>
        <button type="button" onClick={() => exec('redo')} className="px-2 py-1 border rounded text-sm">↷ Redo</button>
        <button type="button" onClick={() => exec('bold')} className="px-2 py-1 border rounded font-bold">B</button>
        <button type="button" onClick={() => exec('italic')} className="px-2 py-1 border rounded italic">I</button>
        <button type="button" onClick={() => exec('underline')} className="px-2 py-1 border rounded underline">U</button>
        <button type="button" onClick={() => exec('insertUnorderedList')} className="px-2 py-1 border rounded">• List</button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="px-2 py-1 border rounded">1. List</button>
        <button type="button" onClick={() => exec('formatBlock', 'H3')} className="px-2 py-1 border rounded">H3</button>
        <button type="button" onClick={() => exec('formatBlock', 'P')} className="px-2 py-1 border rounded">P</button>
        <button type="button" onClick={() => setHtml('')} className="px-2 py-1 border rounded text-red-600">Clear</button>
      </div>

      <div className="border rounded overflow-hidden">
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="min-h-[200px] p-4 focus:outline-none prose max-w-none"
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        მონიშნეთ ტექსტი → გამოიყენეთ ღილაკები. Undo/Redo მუშაობს ბრაუზერის მხარდაჭერით.
      </p>
    </div>
  )
})

export default Editor
