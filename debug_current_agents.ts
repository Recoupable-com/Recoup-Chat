// Script to check current agent_templates table state
// Run this to see what's actually in production database

import { createClient } from '@supabase/supabase-js';

// You'll need to set these environment variables or replace with actual values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getCurrentAgents() {
  try {
    console.log('Fetching current agent_templates from database...\n');
    
    const { data, error } = await supabase
      .from('agent_templates')
      .select('id, title, description, tags, creator, is_private, created_at, updated_at')
      .order('title');
    
    if (error) {
      console.error('Database Error:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('No agents found in database');
      return;
    }
    
    console.log(`Found ${data.length} agents in database:\n`);
    console.log('=====================================');
    
    // Show each agent with current state
    data.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.title}`);
      console.log(`   Tags: [${agent.tags?.join(', ') || 'none'}]`);
      console.log(`   Description: ${agent.description}`);
      console.log(`   Creator: ${agent.creator ? 'User-created' : 'System'}`);
      console.log(`   Private: ${agent.is_private}`);
      console.log(`   Created: ${agent.created_at}`);
      console.log(`   Updated: ${agent.updated_at}`);
      console.log('');
    });
    
    // Show tag distribution
    console.log('\n📊 TAG DISTRIBUTION:');
    console.log('=====================================');
    const tagCounts: Record<string, number> = {};
    data.forEach(agent => {
      agent.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([tag, count]) => {
        console.log(`${tag}: ${count} agents`);
      });
    
  } catch (err) {
    console.error('Script Error:', err);
  }
}

getCurrentAgents();

export {};
