// lib/store.ts
import { create } from 'zustand'

// Report defined - Can be shared
export interface Report {
  id: number;
  type: 'pothole' | 'traffic-light' | 'obstruction' | 'debris' | 'accident';
  severity: 'minor' | 'medium' | 'urgent';
  location: { lat: number; lng: number }; // <-- Corrected location type
  address: string;
  description: string;
  timestamp: string;
  upvotes: number;
  status: 'reported' | 'verified' | 'in-progress' | 'emergency';
  reporter: string;
}

// Add the reports array and an addReport action to the store
interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  reports: Report[];
  setMapView: (center: { lat: number; lng: number }, zoom: number) => void;
  addReport: (report: Omit<Report, 'id' | 'timestamp' | 'reporter'>) => void;
}

// Mock Data
const mockReports: Report[] = [
  { id: 1, type: "pothole", severity: "urgent", location: { lat: -26.2044, lng: 28.0459 }, address: "Main St & 5th Ave", description: "Large pothole causing tire damage", timestamp: "2 hours ago", upvotes: 12, status: "reported", reporter: "John D.", },
  { id: 2, type: "traffic-light", severity: "urgent", location: { lat: -26.1988, lng: 28.0511 }, address: "Oak St & Pine Ave", description: "Traffic light completely out", timestamp: "30 minutes ago", upvotes: 8, status: "in-progress", reporter: "Sarah M.", },
  { id: 3, type: "obstruction", severity: "medium", location: { lat: -26.215, lng: 28.039 }, address: "Elm St near Park", description: "Fallen tree blocking right lane", timestamp: "1 hour ago", upvotes: 5, status: "reported", reporter: "Mike R.", },
];

export const useMapStore = create<MapState>((set) => ({
  center: { lat: -26.2041, lng: 28.0473 },
  zoom: 12,
  reports: mockReports, // Initialize with mock data
  
  setMapView: (center, zoom) => set({ center, zoom }),
  
  // Action to add a new report
  addReport: (newReportData) => set((state) => ({
    reports: [
      ...state.reports,
      {
        ...newReportData,
        id: state.reports.length + 1, // Simple ID generation
        timestamp: new Date().toLocaleTimeString(),
        reporter: "Community Member", // Placeholder reporter
        upvotes: 0,
        status: 'reported',
      }
    ]
  })),
}));