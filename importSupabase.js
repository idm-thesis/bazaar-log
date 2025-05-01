import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

const supabaseUrl = 'https://vgngpwvsgfvnmjofrmtm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbmdwd3ZzZ2Z2bm1qb2ZybXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODY0MzEsImV4cCI6MjA2MTI2MjQzMX0.zKRXkoyCt28b-Kgx1FdEVOLNUhoHpv8DOBH6MMTBbh8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function loadJSON(filename) {
  const data = await fs.readFile(filename, 'utf-8');
  return JSON.parse(data);
}

async function importData() {
  const gameContent = await loadJSON('./src/data/Bazaar_log_game_content.json');
  const contentDecisions = await loadJSON('./src/data/contentDecisions.json');

  for (const item of gameContent) {
    if (item.year === undefined) {
      console.error('警告：item缺少year字段，跳过：', item);
      continue;
    }

    const { data: yearData, error: yearError } = await supabase
      .from('years')
      .insert([{ year: item.year }])
      .select();

    if (yearError) {
      console.error('插入year出错:', yearError);
      continue;
    }

    const year_id = yearData[0].id;
    if (!year_id) {
      console.error(`缺少year_id，跳过 ${item.year}`);
      continue;
    }

    if (item.news) {
      const newsItems = item.news.map(news => ({
        year_id,
        headline: news.headline,
        summary: news.summary,
        decision_trigger: news.decisionTrigger || null
      }));
      const { error: newsError } = await supabase.from('news').insert(newsItems);
      if (newsError) console.error('插入news出错:', newsError);
    }

    if (item.lan_posts) {
      const lanPosts = item.lan_posts.map(post => ({
        year_id,
        title: post.title,
        author: post.author,
        content: post.content
      }));
      const { error: lanError } = await supabase.from('lan_posts').insert(lanPosts);
      if (lanError) console.error('插入lan_posts出错:', lanError);
    }

    if (item.notebook) {
      const notes = item.notebook.map(content => ({
        year_id,
        content
      }));
      const { error: noteError } = await supabase.from('notebooks').insert(notes);
      if (noteError) console.error('插入notebooks出错:', noteError);
    }
  }

  for (const decision of contentDecisions) {
    const { error: decisionError } = await supabase.from('content_decisions').insert([{
      id: decision.id,
      title: decision.title,
      context: decision.context,
      choice_end: decision["choice-end"],
      choice_success: decision["choice-success"],
      choice_end_title: decision["choice-end-title"],
      choice_end_outcome: decision["choice-end-outcome"],
      choice_success_title: decision["choice-success-title"],
      choice_success_outcome: decision["choice-success-outcome"],
    }]);
    if (decisionError) console.error('插入content_decisions出错:', decisionError);
  }

  console.log('✅ 数据导入完成！');
}

importData();
