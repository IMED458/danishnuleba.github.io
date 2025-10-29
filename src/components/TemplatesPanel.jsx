import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'zweck:templates'

export default function TemplatesPanel({ editorRef }) {
  const [templates, setTemplates] = useState([])
  const [title, setTitle] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setTemplates(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  }, [templates])

  function saveTemplate() {
    const html = editorRef.current?.getHtml() || ''
    if (!title) return alert('შეადგინეთ შაბლონის სათაური')
    const item = { title, html, created: Date.now() }
    if (editingIndex >= 0) {
      const next = [...templates]
      next[editingIndex] = { ...next[editingIndex], ...item }
      setTemplates(next)
      setEditingIndex(-1)
    } else {
      setTemplates([item, ...templates])
    }
    setTitle('')
    alert('შაბლონმა შენახა')
  }

  function insertTemplate(i) {
    const t = templates[i]
    if (!t) return
    editorRef.current?.setHtml(t.html)
  }

  function removeTemplate(i) {
    if (!confirm('დაავადებთ შაბლონის წაშლას?')) return
    const next = templates.filter((_, idx) => idx !== i)
    setTemplates(next)
  }

  function editTemplate(i) {
    setEditingIndex(i)
    setTitle(templates[i].title)
    editorRef.current?.setHtml(templates[i].html)
  }

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="font-semibold mb-2">შაბლონები</h3>
      <input
        placeholder="შაბლონის სათაური"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full border rounded px-2 py-1 mb-2"
      />
      <div className="flex gap-2">
        <button onClick={saveTemplate} className="px-3 py-1 rounded bg-emerald-600 text-white">შენახვა შაბლონად</button>
        <button onClick={() => { setTitle(''); setEditingIndex(-1) }} className="px-3 py-1 rounded border">რეზეტი</button>
      </div>
      <div className="mt-3 space-y-2 max-h-56 overflow-auto">
        {templates.length === 0 && <div className="text-sm text-slate-500">შენი შაბლონები ჯერ არ არის შენახული.</div>}
        {templates.map((t, i) => (
          <div key={t.created} className="border rounded p-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-slate-500">შეიქმნა: {new Date(t.created).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => insertTemplate(i)} className="px-2 py-1 border rounded">ჩასმა</button>
              <button onClick={() => editTemplate(i)} className="px-2 py-1 border rounded">თვისება</button>
              <button onClick={() => removeTemplate(i)} className="px-2 py-1 border rounded text-red-600">წაშლა</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
