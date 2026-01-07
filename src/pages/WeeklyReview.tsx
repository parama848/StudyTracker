import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WeeklyReview as WeeklyReviewType } from '@/types/study';
import { getWeeklyReviews, saveWeeklyReview, getWeekNumber, getDailyEntries, calculateDailyCompletion } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Target, Trophy, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function WeeklyReview() {
  const currentWeek = getWeekNumber();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [reviews, setReviews] = useState<WeeklyReviewType[]>(getWeeklyReviews());
  
  const existingReview = reviews.find(r => r.weekNumber === selectedWeek);
  
  const [review, setReview] = useState<Partial<WeeklyReviewType>>(
    existingReview || {
      whatWentWell: '',
      whatWasDifficult: '',
      oneWin: '',
      focusNextWeek: '',
    }
  );

  const handleSave = () => {
    const newReview: WeeklyReviewType = {
      id: existingReview?.id || Date.now().toString(),
      weekNumber: selectedWeek,
      whatWentWell: review.whatWentWell!,
      whatWasDifficult: review.whatWasDifficult!,
      oneWin: review.oneWin!,
      focusNextWeek: review.focusNextWeek!,
    };
    
    saveWeeklyReview(newReview);
    setReviews(getWeeklyReviews());
  };

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const entries = getDailyEntries();
    const startDay = (selectedWeek - 1) * 7 + 1;
    const endDay = selectedWeek * 7;
    
    const weekEntries = entries.filter((_, index) => {
      const dayNumber = index + 1;
      return dayNumber >= startDay && dayNumber <= endDay;
    });
    
    const daysLogged = weekEntries.length;
    const avgCompletion = weekEntries.length > 0
      ? Math.round(weekEntries.reduce((sum, e) => sum + calculateDailyCompletion(e), 0) / weekEntries.length)
      : 0;
    const totalHours = weekEntries.reduce((sum, e) => sum + e.hoursStudied, 0);
    
    return { daysLogged, avgCompletion, totalHours };
  }, [selectedWeek]);

  const handleWeekChange = (week: string) => {
    const weekNum = parseInt(week);
    setSelectedWeek(weekNum);
    const existing = reviews.find(r => r.weekNumber === weekNum);
    setReview(existing || {
      whatWentWell: '',
      whatWasDifficult: '',
      oneWin: '',
      focusNextWeek: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Weekly Self-Review</h1>
            <p className="text-muted-foreground">Reflect on your progress and set intentions</p>
          </div>
          <Select value={selectedWeek.toString()} onValueChange={handleWeekChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 13 }, (_, i) => i + 1).map(week => (
                <SelectItem key={week} value={week.toString()}>
                  Week {week} {week === currentWeek && '(Current)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Week Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{weeklyStats.daysLogged}/7</p>
            <p className="text-xs text-muted-foreground">Days Logged</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-communication/20 flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-communication" />
            </div>
            <p className="text-2xl font-bold">{weeklyStats.avgCompletion}%</p>
            <p className="text-xs text-muted-foreground">Avg Completion</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-dsa/20 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-dsa" />
            </div>
            <p className="text-2xl font-bold">{weeklyStats.totalHours}h</p>
            <p className="text-xs text-muted-foreground">Total Hours</p>
          </div>
        </div>

        {/* Review Form */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-communication" />
                What went well?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={review.whatWentWell}
                onChange={(e) => setReview({ ...review, whatWentWell: e.target.value })}
                placeholder="Celebrate your wins, no matter how small..."
                className="bg-background/50 min-h-32"
              />
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <XCircle className="w-5 h-5 text-oracle" />
                What was difficult?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={review.whatWasDifficult}
                onChange={(e) => setReview({ ...review, whatWasDifficult: e.target.value })}
                placeholder="Acknowledge challenges to overcome them..."
                className="bg-background/50 min-h-32"
              />
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5 text-java" />
                One Win 🎉
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={review.oneWin}
                onChange={(e) => setReview({ ...review, oneWin: e.target.value })}
                placeholder="What's one thing you're proud of this week?"
                className="bg-background/50 min-h-32"
              />
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ArrowRight className="w-5 h-5 text-dsa" />
                Focus Next Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={review.focusNextWeek}
                onChange={(e) => setReview({ ...review, focusNextWeek: e.target.value })}
                placeholder="What's your main focus for next week?"
                className="bg-background/50 min-h-32"
              />
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleSave} size="lg" className="w-full md:w-auto">
          Save Week {selectedWeek} Review
        </Button>

        {/* Previous Reviews */}
        {reviews.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Previous Reviews</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews
                .filter(r => r.weekNumber !== selectedWeek)
                .sort((a, b) => b.weekNumber - a.weekNumber)
                .map(r => (
                  <Card key={r.id} className="glass-card border-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Week {r.weekNumber}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {r.oneWin && (
                        <div className="text-sm">
                          <span className="text-java">🎉</span> {r.oneWin}
                        </div>
                      )}
                      {r.focusNextWeek && (
                        <div className="text-sm text-muted-foreground">
                          <span className="text-dsa">→</span> {r.focusNextWeek}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
