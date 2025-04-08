// src/pages/EventUploadPage.tsx

import { EventForm } from "@components/EventForm"

export default function EventUploadPage() {
  const handleSubmit = (data: any) => {
    console.log("폼 제출됨!", data)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">행사 등록</h2>
      <EventForm onSubmit={handleSubmit} />
    </div>
  )
}
//cd C:\Code\DevKor\TEAM-E-25-1-FE
//npm run dev