import React from 'react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  avatar?: string;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
  title?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data, title = "Leaderboard" }) => {
  return (
    <div className="border-8 border-amber-500 rounded-lg bg-amber-50 overflow-hidden shadow-lg" style={{ borderRadius: '25px' }}>
      <div className="p-4 pb-2">
        <div className="overflow-hidden">
          <table className="min-w-full">
            <tbody>
              {data.map((entry) => (
                <tr key={entry.rank} className="border-b border-amber-200 last:border-b-0">
                  <td className="text-xl font-bold text-gray-900 py-2 pl-4">
                    {entry.rank}. {entry.name}
                  </td>
                  <td className="text-xl font-medium text-gray-900 py-2 pr-4 text-right">
                    {entry.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sample data for testing
export const sampleLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Anonymous", score: 9850 },
  { rank: 2, name: "Anonymous", score: 9720 },
  { rank: 3, name: "Anonymous", score: 9540 },
  { rank: 4, name: "Anonymous", score: 9350 },
  { rank: 5, name: "Anonymous", score: 9120 },
  { rank: 6, name: "Anonymous", score: 8980 },
  { rank: 7, name: "Anonymous", score: 8740 },
  { rank: 8, name: "Anonymous", score: 8560 },
  { rank: 9, name: "Anonymous", score: 8320 },
  { rank: 10, name: "Anonymous", score: 8150 },
];

export default Leaderboard;