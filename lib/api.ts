// lib/api.ts - API service functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface HazardReportData {
  hazard_type: string
  severity: string
  location: string
  description: string
}

export interface InfrastructureRequestData {
  request_type: string
  priority: string
  location: string
  justification: string
}

export interface TrafficLightReportData {
  fault_type: string
  affected_lanes: string
  intersection: string
  traffic_impact: string
}

export interface EmergencyRequestData {
  emergency_type: string
  location: string
  situation: string
  contact: string
}

// Submit hazard report
export async function submitHazardReport(
  data: HazardReportData, 
  files?: File[]
): Promise<any> {
  const formData = new FormData()
  
  // Add form data
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  
  // Add files if any
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('photos', file)
    })
  }
  
  const response = await fetch(`${API_BASE_URL}/api/reports/hazard`, {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to submit hazard report')
  }
  
  return response.json()
}

// Submit infrastructure request
export async function submitInfrastructureRequest(
  data: InfrastructureRequestData,
  files?: File[]
): Promise<any> {
  const formData = new FormData()
  
  // Add form data
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  
  // Add files if any
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('photos', file)
    })
  }
  
  const response = await fetch(`${API_BASE_URL}/api/reports/infrastructure`, {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to submit infrastructure request')
  }
  
  return response.json()
}

// You'll need to add these endpoints to your backend for traffic light and emergency reports
export async function submitTrafficLightReport(
  data: TrafficLightReportData
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/reports/traffic-light`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to submit traffic light report')
  }
  
  return response.json()
}

export async function submitEmergencyRequest(
  data: EmergencyRequestData
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/reports/emergency`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to submit emergency request')
  }
  
  return response.json()
}