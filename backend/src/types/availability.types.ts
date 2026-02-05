// export interface CreateAvailabilityPayload {
//   date: string; 
// }
export interface CreateAvailabilityPayload {
  date: string;            // YYYY-MM-DD
  startDuration: string;   // HH:mm:ss
  endDuration: string;     // HH:mm:ss
}
export interface TimeSlotInput {
  startTime: string; 
  endTime: string;   
}

export interface CreateTimeSlotsPayload {
  slots: TimeSlotInput[];
}

// export interface GetSlotsByDatePayload {
//   doctorId: number;
//   date: string;
// }

export interface GetSlotsByDatePayload {
  doctorId: number;
  date: string;
}