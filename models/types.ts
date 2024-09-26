export interface Beeper {
    id: string;
    name: string;
    status: BeeperStatus;
    created_at: Date;
    detonated_at: Date;  
    longitude?: number; 
    latitude?: number;  
}

export enum BeeperStatus {
    Manufactured = "Manufactured",
    Assembled = "Assembled",
    Shipped = "Shipped",
    Deployed = "Deployed",
    Detonated = "Detonated"
}
