'use client';

import React, { useEffect, useState } from 'react';

interface Submission {
  title: string;
  link: string;
  status: string;
  language: string;
  timestamp: string;
  url: string;
}

interface UserSubmissions {
  username: string;
  submissions: Submission[];
}

const Page = () => {
  const [data, setData] = useState<UserSubmissions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dump')
      .then(res => res.json())
      .then((json: UserSubmissions[]) => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error syncing submissions:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading and syncing submissions...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>All Users Submissions</h1>

      {data.length === 0 && <p>No submissions found.</p>}

      {data.map(user => (
        <div key={user.username} style={{ marginBottom: 40 }}>
          <h2>User: {user.username}</h2>

          {user.submissions.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            <table border={1} cellPadding={8} cellSpacing={0}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Language</th>
                  <th>Timestamp</th>
                  <th>Problem Link</th>
                  <th>Submission Link</th>
                </tr>
              </thead>
              <tbody>
                {user.submissions.map((sub, idx) => (
                  <tr key={idx}>
                    <td>{sub.title}</td>
                    <td>{sub.status}</td>
                    <td>{sub.language}</td>
                    <td>{new Date(sub.timestamp).toLocaleString()}</td>
                    <td>
                      <a href={sub.link} target="_blank" rel="noopener noreferrer">
                        Problem
                      </a>
                    </td>
                    <td>
                      <a href={sub.url} target="_blank" rel="noopener noreferrer">
                        Submission
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default Page;
