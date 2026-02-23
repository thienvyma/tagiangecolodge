import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    const { data, error } = await supabase.from('site_data').select('*');

    // Auto-init the table on first run by executing a SQL function (if defined) or just returning empty
    if (error) {
        if (error.code === '42P01') {
            // Table doesn't exist, this is just for awareness. The user should run the SQL manually.
            return NextResponse.json({ error: 'Bảng "site_data" chưa được tạo trên Supabase. Vui lòng chạy lệnh SQL trong file supabase_schema.sql.' }, { status: 500 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Convert array of {key, value} back to a single state object
    const state: Record<string, any> = {};
    data?.forEach((row: { key: string; value: any }) => {
        state[row.key] = row.value;
    });

    return NextResponse.json(state);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Convert state object to array of {key, value} for upsert
        const rows = Object.entries(body).map(([key, value]) => ({
            key,
            value
        }));

        const { error } = await supabase
            .from('site_data')
            .upsert(rows, { onConflict: 'key' });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
