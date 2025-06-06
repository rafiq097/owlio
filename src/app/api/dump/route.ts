import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import UserSubmissions from '@/models/UserSubmissions';

export const GET = async () => {
  try {
    await connectDB();

    const rawUsernames = process.env.LEETCODE_USERNAMES || '';
    if (!rawUsernames) {
      return NextResponse.json({ error: 'No usernames provided' }, { status: 400 });
    }
    const usernames = [...new Set(rawUsernames.split(',').map(name => name.trim()))];
    console.log('usernames:', usernames);

    for (const username of usernames) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_2LC}${username}/submissions`);
      const json = await res.json();

      if (!json) continue;

      const newSubmissions = json.map(sub => ({
        title: sub.title,
        link: `https://leetcode.com/problems/${sub.titleSlug}`,
        status: sub.statusDisplay,
        language: sub.lang,
        timestamp: new Date(parseInt(sub.timestamp) * 1000),
        url: `https://leetcode.com${sub.url}`,
      }));
      
      const existingRecord = await UserSubmissions.findOne({ username });

      let finalSubmissions = [];

      if (existingRecord) {
        const existingSet = new Set(
          existingRecord.submissions.map(s => `${s.timestamp}-${s.url}`)
        );

        const filteredNew = newSubmissions.filter(
          sub => !existingSet.has(`${sub.timestamp}-${sub.url}`)
        );

        finalSubmissions = [...filteredNew, ...existingRecord.submissions];
        
        console.log(`Found ${filteredNew.length} new submissions for ${username}`);
      } else {
        finalSubmissions = newSubmissions;
      }

      await UserSubmissions.findOneAndUpdate(
        { username },
        { username, submissions: finalSubmissions },
        { upsert: true, new: true }
      );

      console.log(`Synced submissions for ${username}: ${finalSubmissions.length} total entries`);
    }

    const allSubmissions = await UserSubmissions.find({});
    return NextResponse.json(allSubmissions);
  } catch (error) {
    console.error('Dump error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};