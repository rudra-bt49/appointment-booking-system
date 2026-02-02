export interface CreateAvailabilityPayload {
  date: string; 
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
