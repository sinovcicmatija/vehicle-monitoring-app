export interface ServiceEventDTO {
    vin: string,
    performedDate: string,
    mileageAtService: number,
    notes?: string,
    performedServices: string[]

}