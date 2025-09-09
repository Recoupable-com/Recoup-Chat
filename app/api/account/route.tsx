import { NextRequest } from "next/server";
import getAccountByEmail from "@/lib/supabase/accounts/getAccountByEmail";
import { getAccountByWallet } from "@/lib/supabase/accounts/getAccountByWallet";
import { getAccountWithDetails } from "@/lib/supabase/accounts/getAccountWithDetails";
import insertAccount from "@/lib/supabase/accounts/insertAccount";
import insertAccountEmail from "@/lib/supabase/accountEmails/insertAccountEmail";
import { insertAccountWallet } from "@/lib/supabase/accounts/insertAccountWallet";
import { initializeAccountCredits } from "@/lib/supabase/credits_usage/initializeAccountCredits";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email;
  const wallet = body.wallet;

  try {
    // If email is provided, check account_emails
    if (email) {
      try {
        const emailRecord = await getAccountByEmail(email);
        if (emailRecord?.account_id) {
          const accountData = await getAccountWithDetails(
            emailRecord.account_id
          );
          return Response.json({ data: accountData }, { status: 200 });
        }
      } catch (error) {
        console.log(
          "Email not found, creating new account:",
          error instanceof Error ? error.message : "Unknown error"
        );
        // Continue to wallet check if email not found
      }
    }

    if (wallet) {
      try {
        const account = await getAccountByWallet(wallet);
        const accountData = {
          ...account.account_info[0],
          ...account.account_emails[0],
          ...account.account_wallets[0],
          ...account,
        };
        return Response.json({ data: accountData }, { status: 200 });
      } catch (error) {
        console.log(
          "Wallet not found, checking email:",
          error instanceof Error ? error.message : "Unknown error"
        );
        // Continue to create new account if wallet not found
      }
    }

    const newAccount = await insertAccount({ name: "" });

    if (!newAccount) {
      throw new Error("Failed to create account");
    }

    if (email) {
      await insertAccountEmail(newAccount.id, email);
    }

    if (wallet) {
      await insertAccountWallet(newAccount.id, wallet);
    }

    // Initialize credits
    await initializeAccountCredits(newAccount.id, 1);

    const newAccountData = {
      id: newAccount.id,
      account_id: newAccount.id,
      email: email || "",
      wallet: wallet || "",
      image: "",
      instruction: "",
      organization: "",
    };

    return Response.json({ data: newAccountData }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
