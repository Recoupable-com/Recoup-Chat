import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const instruction = body.instruction;
  const name = body.name;
  const organization = body.organization;
  const accountId = body.accountId;
  const image = body.image;

  const client = getSupabaseServerAdminClient();

  try {
    const { data: found } = await client
      .from("accounts")
      .select("*, account_emails(email)")
      .eq("id", accountId)
      .single();

    if (found) {
      await client
        .from("accounts")
        .update({
          id: accountId,
          name,
        })
        .eq("id", accountId)
        .select("*")
        .single();
      const { data: account_info } = await client
        .from("account_info")
        .select("*")
        .eq("account_id", accountId)
        .single();
      if (!account_info) {
        await client
          .from("account_info")
          .insert({
            organization,
            image,
            instruction,
            account_id: accountId,
          })
          .eq("account_id", accountId)
          .select("*")
          .single();
        return Response.json(
          {
            data: {
              organization,
              image,
              instruction,
              account_id: accountId,
              name,
              email: found.account_emails[0].email,
            },
          },
          { status: 200 },
        );
      }
      const { data: updated_account_info } = await client
        .from("account_info")
        .update({
          ...account_info,
          organization,
          image,
          instruction,
        })
        .eq("account_id", accountId)
        .select("*")
        .single();
      return Response.json(
        {
          data: {
            ...updated_account_info,
            name,
            email: found.account_emails[0].email,
          },
        },
        { status: 200 },
      );
    }

    return Response.json({ data: null }, { status: 400 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
