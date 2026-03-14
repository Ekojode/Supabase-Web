import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate the User
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized: Please log in to create a group.' }, { status: 401 });
        }

        const resendKey = process.env.RESEND_API_KEY;
        const resend = new Resend(resendKey || 'fake-key-to-prevent-crash');

        // Initialize Admin Client to bypass normal user RLS
        const adminSupabase = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Ensure User Profile exists (Resolves Foreign Key errors)
        await adminSupabase.from('profiles').upsert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        }, { onConflict: 'id' });

        const body = await request.json();
        const { service_name, custom_name, expected_price, duration, slots, friends_invited } = body;

        console.log(`Received authenticated group creation request for ${service_name} from user:`, user.id);

        if (!service_name || !slots || !duration) {
            return NextResponse.json(
                { error: 'Service name, duration, and slots are required' },
                { status: 400 }
            );
        }

        // 2. Parse the expected price into a usable number
        let totalBasePrice = 0.00;
        if (expected_price) {
            const numericString = expected_price.replace(/[^0-9.]/g, '');
            totalBasePrice = parseFloat(numericString);
            if (isNaN(totalBasePrice)) totalBasePrice = 0.00;
        }

        const parsedSlots = parseInt(slots);
        const pricePerMember = parsedSlots > 0 ? Math.round(totalBasePrice / parsedSlots) : 0;

        // 3. Find or Create the Subscription in the catalog
        let subscriptionId = null;
        const actualServiceName = service_name === 'Other' && custom_name ? custom_name : service_name;

        const { data: existingSub } = await adminSupabase
            .from('subscriptions')
            .select('id')
            .eq('name', actualServiceName)
            .single();

        if (existingSub) {
            subscriptionId = existingSub.id;
        } else {
            // Create a new subscription entry with basic details
            const { data: newSub, error: subInsertError } = await adminSupabase
                .from('subscriptions')
                .insert({
                    name: actualServiceName,
                    base_price: totalBasePrice,
                    max_members: parsedSlots
                })
                .select('id')
                .single();

            if (subInsertError) {
                console.error("Failed to insert new subscription into catalog", subInsertError);
            } else if (newSub) {
                subscriptionId = newSub.id;
            }
        }

        // 4. Insert the precise Group into the live ledger
        const { data: newGroup, error: groupInsertError } = await adminSupabase
            .from('groups')
            .insert({
                provider_id: user.id,
                subscription_id: subscriptionId,
                total_slots: parsedSlots,
                duration_months: parseInt(duration),
                price_per_member: pricePerMember,
                status: 'open'
            })
            .select('id')
            .single();

        if (groupInsertError) {
            console.error('Supabase INSERT Error (Group):', groupInsertError);
            return NextResponse.json(
                { error: 'Failed to create your live group on Subbay.' },
                { status: 500 }
            );
        }

        console.log('Live Group created:', newGroup.id);

        // 5. Send Invite Emails to Friends (if any are provided)
        if (friends_invited && Array.isArray(friends_invited) && friends_invited.length > 0 && resendKey) {
            const validEmails = friends_invited.filter(email => email && email.includes('@'));

            for (const friendEmail of validEmails) {
                const targetEmail = process.env.NODE_ENV === 'development' ? 'delivered@resend.dev' : friendEmail;

                try {
                    await resend.emails.send({
                        from: 'Subb Bay <onboarding@resend.dev>',
                        to: [targetEmail],
                        subject: `You've been invited to join a ${actualServiceName} group! 🚀`,
                        html: `
                        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                            <h2 style="color: #1A1A2E;">You've been invited!</h2>
                            <p style="color: #3A5369; font-size: 16px; line-height: 1.5;">
                                A friend has reserved a spot for you in their <strong>${actualServiceName}</strong> group on Subbay.
                            </p>
                            <p style="color: #3A5369; font-size: 16px; line-height: 1.5;">
                                By joining, you'll instantly share access and heavily reduce your subscription costs. 
                                Click below to create an account and join the group securely!
                            </p>
                            <br/>
                            <p style="color: #3A5369; font-size: 14px;">
                                - The Subb Bay Team
                            </p>
                        </div>
                    `,
                    });
                    console.log(`Invite sent to ${friendEmail}`);
                } catch (err) {
                    console.error(`Failed to send invite to ${friendEmail}`, err);
                }
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully created group and notified friends'
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('General API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
