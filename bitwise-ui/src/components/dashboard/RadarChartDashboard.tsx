import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { apiService } from '@/services/api.service';

interface MasteryData {
  topic: string;
  currentEMA: number;
}

export function RadarChartDashboard({ userId }: { userId: string }) {
  const [data, setData] = useState<{ subject: string; A: number; fullMark: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Map of internal topic IDs to display names
  const topicMap: Record<string, string> = {
    'boolean-algebra': 'Boolean Algebra',
    'number-systems': 'Number Systems',
    'binary-arithmetic': 'Binary Arithmetic',
    'complements': 'Complements',
    'binary-codes': 'Binary Codes',
    'logic-gates': 'Logic Gates',
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setData([]);
    if (!userId) { setLoading(false); return; }

    apiService.get<{success: boolean; data: MasteryData[]; error?: string}>(`/assessment/mastery/${encodeURIComponent(userId)}`, true)
      .then(resData => {
        if (!active) return;
        if (!resData.success || !Array.isArray(resData.data)) throw new Error(resData.error || 'Mastery data is unavailable');
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
            const key = item.topic === 'number-conversions' ? 'number-systems' : item.topic;
            const displayTopic = topicMap[key] || key.replace(/-/g, ' ');
            const dataRow = formattedData.find(d => d.subject === displayTopic);
            if (dataRow) {
              // Convert EMA 0.0-1.0 to 0-100 scale for better visualization
              dataRow.A = Math.round(Math.max(0, Math.min(1, Number(item.currentEMA) || 0)) * 100);
            } else {
              formattedData.push({subject: displayTopic, A: Math.round(Math.max(0, Math.min(1, Number(item.currentEMA) || 0)) * 100), fullMark: 100});
            }
          });

          setData(formattedData);
        }
      })
      .catch(err => { if (active) setError(err.message || 'Could not load mastery'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
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
        {error ? <p role="alert" className="text-destructive">{error}</p> : <>
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
        <dl aria-label="Mastery scores" className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {data.map(item => (
            <div key={item.subject} className="flex justify-between gap-2">
              <dt className="text-muted-foreground">{item.subject}</dt>
              <dd className="font-medium">{item.A}%</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>Outer Edge = Mastery</span>
          <span>Center = Beginner</span>
        </div>
        </>}
      </CardContent>
    </Card>
  );
}

export default RadarChartDashboard;
