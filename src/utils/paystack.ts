/**
 * Calculates the gross amount to charge a user via Paystack
 * in order to receive the exact requested net amount (passing the fee to the user).
 * Paystack Local Transaction Fee: 1.5% + NGN 100 (if >= NGN 2500), capped at NGN 2000.
 */
export function calculateGrossAmount(netAmount: number): number {
    if (netAmount <= 0) return 0;

    let grossAmount = 0;

    // We can solve algebraically:
    // Case 1: Gross < 2500 (No flat NGN 100 fee)
    // net = gross * (1 - 0.015) = 0.985 * gross
    // gross = net / 0.985
    const tentativeGrossSmall = netAmount / 0.985;
    
    if (tentativeGrossSmall < 2500) {
        grossAmount = tentativeGrossSmall;
    } else {
        // Case 2: Gross >= 2500 (Has NGN 100 flat fee)
        // net = gross - (0.015 * gross + 100) = 0.985 * gross - 100
        // gross = (net + 100) / 0.985
        const tentativeGrossLarge = (netAmount + 100) / 0.985;
        
        // Capped fee is NGN 2000. 
        // 0.015 * gross + 100 = 2000 => gross = 126666.67
        if (tentativeGrossLarge >= 126666.67) {
            // Case 3: Fee is capped at NGN 2000
            // net = gross - 2000
            grossAmount = netAmount + 2000;
        } else {
            grossAmount = tentativeGrossLarge;
        }
    }

    // Paystack amounts are typically in kobo, but we return Naira here.
    return Math.ceil(grossAmount);
}
