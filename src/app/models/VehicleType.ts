export interface VehicleType {
    vehicleName: string;
    vehicleNumber: string;
    properties: {
        property: string;
        price: number;
    }[];
    fcDate: string;
    insuranceDate: string;
}