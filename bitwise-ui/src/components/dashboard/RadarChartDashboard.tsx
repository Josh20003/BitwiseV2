import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface MasteryData {
  topic: string;
  currentEMA: number;
}

export function RadarChartDashboard({ userId }: { userId: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Map of internal topic IDs to display names
  const topicMap: Record<string, string> = {
    'boolean-algebra': 'Boolean Algebra',
    'number-conversions': 'Number Conversions',
    'binary-arithmetic': 'Binary Arithmetic',
    'complements': 'Complements',
    'binary-codes': 'Binary Codes'
  };

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/assessment/mastery/${userId}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          // Format data for Recharts
          // Default all topics to 0
          const formattedData = Object.keys(topicMap).map(key => ({
            subject: topicMap[key],
            A: 0,
            fullMark: 100,
          }));

          // Merge fetched data
          resData.data.forEach((item: MasteryData) => {
            const displayTopic = topicMap[item.topic] || item.topic;
            const dataRow = formattedData.find(d => d.subject === displayTopic);
            if (dataRow) {
              // Convert EMA 0.0-1.0 to 0-100 scale for better visualization
              dataRow.A = Math.round(item.currentEMA * 100);
            }
          });

          setData(formattedData);
        }
      })
      .catch(err => console.error("Error fetching mastery data:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Analytics...</div>;
  }

  return (
    <Card className="w-full h-full min-h-[400px]">
      <CardHeader>
        <CardTitle>Skill Mastery Radar</CardTitle>
        <CardDescription>
          A multi-dimensional view of your competence across core Computer Organization concepts based on the Exponential Moving Average (EMA) of your assessments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--foreground)', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--muted-foreground)' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--primary)' }}
                formatter={(value: number) => [`${value}% Mastery`, 'Score']}
              />
              <Radar
                name="Mastery"
                dataKey="A"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>Outer Edge = Mastery</span>
          <span>Center = Beginner</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default RadarChartDashboard;
