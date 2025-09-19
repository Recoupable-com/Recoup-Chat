import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('agent_templates')
      .select('id, title, description, tags, creator, is_private, created_at, updated_at')
      .order('title');
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Organize data for easy analysis
    const result = {
      total_agents: data?.length || 0,
      agents: data || [],
      tag_distribution: {} as Record<string, number>,
      system_vs_user: {
        system_agents: 0,
        user_agents: 0
      }
    };
    
    // Calculate tag distribution and system vs user counts
    data?.forEach(agent => {
      // Count system vs user agents
      if (agent.creator) {
        result.system_vs_user.user_agents++;
      } else {
        result.system_vs_user.system_agents++;
      }
      
      // Count tag distribution
      agent.tags?.forEach(tag => {
        result.tag_distribution[tag] = (result.tag_distribution[tag] || 0) + 1;
      });
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch agent templates' }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
