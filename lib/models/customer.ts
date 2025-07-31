export interface Customer {
    id?: number
    unique_id: string
    feedback_unique_id?: string
    
    // Basic Customer Information
    name: string
    phone?: string
    email?: string
    gender?: 'Male' | 'Female' | 'Other'
    dob?: string
    anniversary_date?: string
    
    // Booking Information
    location?: string
    place?: string
    booking_date?: string
    time_stamp?: string
    booking_type?: string
    group_type?: string
    game?: string
    slot?: string
    upcoming?: boolean
    event_date_time?: string
    form_number?: string
    
    // Team Information
    team_id?: string
    team_name?: string
    
    // Additional Information
    signature?: string
    id_proof?: string
    
    // System Fields
    created_at?: string
    updated_at?: string
}

export interface CustomerCreateRequest {
    Unique_ID: string
    Location?: string
    Place?: string
    Booking_Date?: string
    Time_Stamp?: string
    Booking_Type?: string
    Group_Type?: string
    Game?: string
    Slot?: string
    Upcoming?: boolean
    Event_Date_Time?: string
    Form_Number?: string
    TeamId?: string
    Team_name?: string
    name: string
    phone?: string
    email?: string
    Gender?: 'Male' | 'Female' | 'Other'
    dob?: string
    Anniversary_Date?: string
    Signature?: string
    Id_Proof?: string
}

export interface CustomerResponse {
    success: boolean
    message: string
    data?: Customer
} 