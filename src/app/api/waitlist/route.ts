import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(request: Request) {
    try {
        // 1. Validate Environment Variables early
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        // Prioritize the Service Role Key to bypass RLS completely on the server-side.
        // Fallback to Anon Key just in case, but warn them it might hit RLS blocks.
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
            console.warn('Missing Resend API Key. Emails will not be sent, but database records will be saved.');
        }

        // Initialize Clients inside the handler so they don't crash the entire module on boot
        const supabase = createClient(supabaseUrl, supabaseKey);
        const resend = new Resend(resendKey || 'fake-key-to-prevent-crash');
        const body = await request.json();
        const { email, phone } = body;

        console.log('Received waitlist submission for:', email);

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
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
                    // If they are strictly joining the waitlist directly, this is FALSE
                    joined_via_group_creation: false
                },
                {
                    onConflict: 'email',
                    ignoreDuplicates: false // We want to update their info if they re-submit
                }
            )
            .select()
            .single();

        if (upsertError) {
            console.error('Supabase UPSERT Error:', upsertError);
            return NextResponse.json(
                { error: 'Failed to join waitlist. Please try again later.' },
                { status: 500 }
            );
        }

        console.log('User upserted successfully:', user.id);

        // 2. ONLY send the email if 'welcome_email_sent' is FALSE and resendKey exists
        if (!user.welcome_email_sent && resendKey) {

            // NOTE: Replace 'onboarding@resend.dev' with your verified domain when going to production.
            // Replace 'delivered@resend.dev' with the user.email when going to production.
            const targetEmail = process.env.NODE_ENV === 'development' ? 'delivered@resend.dev' : email;

            console.log('Attempting to send welcome email to:', targetEmail);

            try {
                const { data: emailData, error: emailError } = await resend.emails.send({
                    from: 'Subb Bay <onboarding@resend.dev>',
                    to: [targetEmail],
                    subject: 'You\'re on the list! Welcome to Subb Bay 🎉',
                    html: `
                        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                            <h2 style="color: #1A1A2E;">You're in!</h2>
                            <p style="color: #3A5369; font-size: 16px; line-height: 1.5;">
                                Thanks for joining the Subb Bay waitlist! We are currently letting users in gradually to ensure the best experience.
                            </p>
                            <p style="color: #3A5369; font-size: 16px; line-height: 1.5;">
                                We'll send you an invite link as soon as a spot opens up for you to start sharing premium subscriptions securely.
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
                    // We don't necessarily want to fail the whole request if just the email failed,
                    // but we should log it.
                } else {
                    console.log('Welcome email sent successfully:', emailData);

                    // 3. Update the database to reflect that the email was sent
                    await supabase
                        .from('waitlist_users')
                        .update({ welcome_email_sent: true })
                        .eq('id', user.id);
                }
            } catch (err) {
                console.error('Failed to execute Resend block:', err);
            }
        } else {
            console.log('User already received welcome email, skipping send.');
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully joined waitlist',
                user: { id: user.id }
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
