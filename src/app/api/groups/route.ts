import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(request: Request) {
    try {
        // Validate Environment Variables early
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const resendKey = process.env.RESEND_API_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase Environment Variables');
            return NextResponse.json(
                { error: 'Something went wrong. Please try again later.' },
                { status: 500 }
            );
        }

        if (!resendKey) {
            console.warn('Missing Resend API Key. Emails will not be sent.');
        }

        // Initialize Clients inside the handler
        const supabase = createClient(supabaseUrl, supabaseKey);
        const resend = new Resend(resendKey || 'fake-key-to-prevent-crash');
        const body = await request.json();
        const { email, phone, service_name, custom_name, expected_price, slots, friends_invited } = body;

        console.log(`Received group creation request for ${service_name} from:`, email);

        if (!email || !service_name || !slots) {
            return NextResponse.json(
                { error: 'Email, service name, and slots are required' },
                { status: 400 }
            );
        }

        // 1. UPSERT the user into the waitlist_users table
        const { data: user, error: upsertError } = await supabase
            .from('waitlist_users')
            .upsert(
                {
                    email: email,
                    phone: phone || null,
                    // If this is a brand new row, we track that they joined via group creation
                    joined_via_group_creation: true,
                    // We also mark welcome_email_sent as true so they NEVER get the generic waitlist email
                    welcome_email_sent: true
                },
                {
                    onConflict: 'email',
                    ignoreDuplicates: false
                }
            )
            .select()
            .single();

        if (upsertError) {
            console.error('Supabase UPSERT Error (User):', upsertError);
            return NextResponse.json(
                { error: 'Failed to find/create user record.' },
                { status: 500 }
            );
        }

        console.log('User identified/upserted:', user.id);

        // 2. INSERT the specific group request into user_groups table
        const { data: groupReq, error: groupInsertError } = await supabase
            .from('user_groups')
            .insert({
                user_id: user.id,
                service_name: service_name,
                custom_name: custom_name || null,
                expected_price: expected_price || null,
                slots: parseInt(slots),
                friends_invited: friends_invited || []
            })
            .select()
            .single();

        if (groupInsertError) {
            console.error('Supabase INSERT Error (Group):', groupInsertError);
            return NextResponse.json(
                { error: 'Failed to record group request.' },
                { status: 500 }
            );
        }

        console.log('Group recorded:', groupReq.id);

        // 3. Send the specific "Group Recorded" email (if Resend is configured)
        if (resendKey) {
            const targetEmail = process.env.NODE_ENV === 'development' ? 'delivered@resend.dev' : email;
            const displayName = service_name === 'Other' && custom_name ? custom_name : service_name;

            console.log('Attempting to send group specific email to:', targetEmail);

            try {
                const { data: emailData, error: emailError } = await resend.emails.send({
                    from: 'Subb Bay <onboarding@resend.dev>',
                    to: [targetEmail],
                    subject: `Your ${displayName} Group is in the queue! 🚀`,
                    html: `
                    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                        <h2 style="color: #1A1A2E;">Great news!</h2>
                        <p style="color: #3A5369; font-size: 16px; line-height: 1.5;">
                            We have successfully recorded your request to create a <strong>${displayName}</strong> group with <strong>${slots} slots</strong>.
                        </p>
                        <p style="color: #3A5369; font-size: 16px; line-height: 1.5;">
                            Subb Bay is currently letting users in gradually. As soon as we have enough verified users to fill your group (or when your invited friends join), we will send you an activation link!
                        </p>
                        <br/>
                        <p style="color: #3A5369; font-size: 14px;">
                            - The Subb Bay Team
                        </p>
                    </div>
                `,
                });

                if (emailError) {
                    console.error('Resend Email Error:', emailError);
                } else {
                    console.log('Group email sent successfully:', emailData);

                    // Update table to reflect email sent
                    await supabase
                        .from('user_groups')
                        .update({ group_notification_sent: true })
                        .eq('id', groupReq.id);
                }
            } catch (err) {
                console.error('Failed to execute Resend block:', err);
            }
        } else {
            console.log('Skipping email send because RESEND_API_KEY is missing.');
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully recorded group request'
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('General API API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
