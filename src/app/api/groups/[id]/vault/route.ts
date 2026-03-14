import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { login_email, login_password } = body;

        const resolvedParams = await params;

        // 1. Verify this user is the actual Provider of the group
        const { data: group } = await supabase
            .from('groups')
            .select('provider_id')
            .eq('id', resolvedParams.id)
            .single();

        if (!group || group.provider_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden. Only the group provider can update the vault.' }, { status: 403 });
        }

        // 2. Upsert the Vault credentials
        // Using the admin client because the RLS policy for group_vaults might block standard inserts
        // if the record doesn't exist yet, but we've explicitly verified ownership above.
        const { error: upsertError } = await supabase
            .from('group_vaults')
            .upsert({
                group_id: resolvedParams.id,
                login_email,
                login_password,
                updated_at: new Date().toISOString()
            }, { onConflict: 'group_id' });

        if (upsertError) {
            console.error("Vault Upsert Error:", upsertError);
            return NextResponse.json({ error: 'Failed to update vault credentials' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Vault updated successfully' });

    } catch (error) {
        console.error("Vault API Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await params;

        // The RLS policy natively handles the read permissions here. 
        // If they aren't the Provider OR an 'active' member, this select will safely return no rows.
        const { data: vault, error } = await supabase
            .from('group_vaults')
            .select('login_email, login_password, updated_at')
            .eq('group_id', resolvedParams.id)
            .single();

        if (error) {
            // It's normal for a vault to be empty initially, or inaccessible if not paid
            return NextResponse.json({ vault: null });
        }

        return NextResponse.json({ vault });

    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
