import { NextRequest,NextResponse } from "next/server";
import Database from "@/lib/database";

export async function POST(request:NextRequest){
    try {
        const {
            Unique_ID,
            Location,
            Place,
            Booking_Date,
            Time_Stamp,
            Booking_Type,
            Group_Type,
            Game,
            Slot,
            Upcoming,
            Event_Date_Time,
            Form_Number,
            TeamId,
            Team_name,
            name,
            phone,
            email,
            Gender,
            dob,
            Anniversary_Date,
            Signature,
            Id_Proof
        } = await request.json()

        // Validate required fields
        if (!Unique_ID) {
            return NextResponse.json({success: false, message: "Unique_ID is required"}, {status: 400})
        }

        if (!name) {
            return NextResponse.json({success: false, message: "Customer name is required"}, {status: 400})
        }

        // Check if customer already exists
        const existingCustomer = await Database.query("SELECT * FROM customers WHERE unique_id = ?", [Unique_ID])
        if(existingCustomer.length > 0){
            return NextResponse.json({success: false, message: "Customer already exists"}, {status: 400})
        }

        // Insert customer with all fields
        await Database.query(`
            INSERT INTO customers (
                unique_id,
                location,
                place,
                booking_date,
                time_stamp,
                booking_type,
                group_type,
                game,
                slot,
                upcoming,
                event_date_time,
                form_number,
                team_id,
                team_name,
                name,
                phone,
                email,
                gender,
                dob,
                anniversary_date,
                signature,
                id_proof
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            Unique_ID,
            Location,
            Place,
            Booking_Date,
            Time_Stamp,
            Booking_Type,
            Group_Type,
            Game,
            Slot,
            Upcoming || false,
            Event_Date_Time,
            Form_Number,
            TeamId,
            Team_name,
            name,
            phone,
            email,
            Gender,
            dob,
            Anniversary_Date,
            Signature,
            Id_Proof
        ])

        return NextResponse.json({success: true, message: "Customer created successfully"}, {status: 200})
    } catch (error) {
        console.log("Error from Customer API:", error)
        return NextResponse.json({success: false, message: "Error from Customer API"}, {status: 500})
    }
}

// GET - Fetch customer by unique_id
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const uniqueId = searchParams.get('unique_id')
        
        if (!uniqueId) {
            return NextResponse.json({success: false, message: "unique_id parameter is required"}, {status: 400})
        }

        const customer = await Database.queryOne("SELECT * FROM customers WHERE unique_id = ?", [uniqueId])
        
        if (!customer) {
            return NextResponse.json({success: false, message: "Customer not found"}, {status: 404})
        }

        return NextResponse.json({success: true, data: customer}, {status: 200})
    } catch (error) {
        console.log("Error fetching customer:", error)
        return NextResponse.json({success: false, message: "Error fetching customer"}, {status: 500})
    }
}