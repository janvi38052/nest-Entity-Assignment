export class CreateTrainDto {
  trainName: string;
  trainNumber: string;
  stationIds?: number[]; 
  bookingIds?: number[]; 
}

export class UpdateTrainDto {
  trainName?: string; 
  trainNumber?: string; 
  stationIds?: number[]; 
  bookingIds?: number[]; 
}
