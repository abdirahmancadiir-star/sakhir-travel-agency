import { supabase } from './supabase'

export type VisaStatus = 'submitted' | 'under_review' | 'processing' | 'approved' | 'rejected'

export const VISA_STATUS_OPTIONS: Array<{ value: VisaStatus; label: string }> = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'processing', label: 'Processing' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export function getVisaStatusLabel(status?: string | null) {
  const entry = VISA_STATUS_OPTIONS.find((item) => item.value === (status || '').toLowerCase().replace(/\s+/g, '_'))
  if (entry) return entry.label
  return status || 'Submitted'
}

export function getVisaStatusTone(status?: string | null) {
  const normalized = (status || '').toLowerCase().replace(/\s+/g, '_')
  switch (normalized) {
    case 'approved':
      return 'bg-emerald-400/10 text-emerald-100 border-emerald-400/30'
    case 'rejected':
      return 'bg-rose-500/10 text-rose-100 border-rose-400/30'
    case 'processing':
    case 'under_review':
      return 'bg-amber-400/10 text-amber-100 border-amber-400/30'
    default:
      return 'bg-sky-400/10 text-sky-100 border-sky-400/30'
  }
}

export async function uploadVisaDocument(applicationId: string, file: File, documentType: string, uploadedBy: string) {
  const filePath = `visa-documents/${applicationId}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`

  const { error: uploadError } = await supabase.storage.from('visa-documents').upload(filePath, file, { upsert: false, cacheControl: '3600' })

  let fileUrl = ''
  if (!uploadError) {
    const { data: signedData, error: signedUrlError } = await supabase.storage.from('visa-documents').createSignedUrl(filePath, 60 * 60 * 6)
    if (!signedUrlError && signedData?.signedUrl) {
      fileUrl = signedData.signedUrl
    } else {
      const { data: publicData } = supabase.storage.from('visa-documents').getPublicUrl(filePath)
      fileUrl = publicData?.publicUrl || ''
    }
  }

  const { data, error } = await supabase
    .from('visa_documents')
    .insert({
      visa_application_id: applicationId,
      document_type: documentType,
      file_name: file.name,
      file_path: filePath,
      file_url: fileUrl || null,
      file_size: file.size,
      mime_type: file.type || 'application/octet-stream',
      uploaded_by: uploadedBy,
    })
    .select('id, file_url, file_name, document_type')
    .single()

  if (error) throw error
  return data
}

export async function saveVisaStatus(applicationId: string, status: VisaStatus, note: string, changedBy?: string) {
  const { error } = await supabase.from('visa_applications').update({ status, notes: note || null }).eq('id', applicationId)
  if (error) throw error

  await supabase.from('visa_status_history').insert({
    visa_application_id: applicationId,
    status,
    note: note || 'Status updated by the admin team.',
    changed_by: changedBy || null,
  })
}

export async function fetchVisaDocuments(applicationId: string) {
  const { data, error } = await supabase.from('visa_documents').select('*').eq('visa_application_id', applicationId).order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchVisaStatusHistory(applicationId: string) {
  const { data, error } = await supabase.from('visa_status_history').select('*').eq('visa_application_id', applicationId).order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}
