export interface CreateAvailabilityPayload {
  date: string;            
  startDuration: string;   
  endDuration: string;     
}
export interface TimeSlotInput {
  startTime: string; 
  endTime: string;   
}

export interface CreateTimeSlotsPayload {
  slots: TimeSlotInput[];
}
export interface GetSlotsByDatePayload {
  doctorId: number;
  date: string;
}

export interface GetAvailableDatesPayload {
  doctorId: number;
}
