import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CHALLENGES } from "@/lib/mockData";
import { useLocalStorage, ChallengeProgress } from "@/lib/storage";
import { Trophy, Calendar, CheckCircle, Play, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function Challenges() {
  const [progress, setProgress] = useLocalStorage<Record<string, ChallengeProgress>>("fw_challenge_progress", {});
  const [selectedChallenge, setSelectedChallenge] = useState<typeof CHALLENGES[0] | null>(null);
  const { toast } = useToast();

  const startChallenge = (id: string) => {
    setProgress({
      ...progress,
      [id]: { startDate: new Date().toISOString(), completedDays: [], streak: 0 }
    });
    toast({ title: "Challenge Started!", description: "Good luck! Consistency is key." });
  };

  const resetChallenge = (id: string) => {
    if (confirm("Are you sure you want to reset your progress?")) {
       const newProgress = { ...progress };
       delete newProgress[id];
       setProgress(newProgress);
       toast({ title: "Challenge Reset" });
       setSelectedChallenge(null);
    }
  };

  const toggleDay = (challengeId: string, dayIndex: number) => {
    const current = progress[challengeId];
    if (!current) return;

    let newCompleted = [...current.completedDays];
    if (newCompleted.includes(dayIndex)) {
      newCompleted = newCompleted.filter(d => d !== dayIndex);
    } else {
      newCompleted.push(dayIndex);
    }

    setProgress({
      ...progress,
      [challengeId]: { ...current, completedDays: newCompleted }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold text-white mb-2">Challenges</h1>
        <p className="text-muted-foreground">Push your limits with our curated 30-day programs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CHALLENGES.map((challenge) => {
          const userProgress = progress[challenge.id];
          const percent = userProgress ? Math.round((userProgress.completedDays.length / challenge.durationDays) * 100) : 0;

          return (
            <Card 
              key={challenge.id} 
              className="group bg-card border-white/5 hover:border-primary/30 transition-all cursor-pointer flex flex-col overflow-hidden"
              onClick={() => setSelectedChallenge(challenge)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={challenge.image} 
                  alt={challenge.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1552674605-46d531d06f9c?auto=format&fit=crop&w=800&q=80')}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-heading font-bold text-white">{challenge.title}</h3>
                  <p className="text-xs text-gray-300 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {challenge.durationDays} Days
                  </p>
                </div>
                {userProgress && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/20">
                    {percent}% Complete
                  </div>
                )}
              </div>
              
              <CardContent className="p-4 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{challenge.description}</p>
                {userProgress ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span className="text-white">{userProgress.completedDays.length} / {challenge.durationDays} Days</span>
                    </div>
                    <Progress value={percent} className="h-1.5" />
                  </div>
                ) : (
                  <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10">
                    View Details
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Challenge Details Modal */}
      <Dialog open={!!selectedChallenge} onOpenChange={(open) => !open && setSelectedChallenge(null)}>
        <DialogContent className="max-w-3xl bg-card border-white/10 text-white p-0 overflow-hidden h-[80vh] flex flex-col">
          {selectedChallenge && (() => {
             const userProgress = progress[selectedChallenge.id];
             return (
               <>
                 <DialogHeader className="p-6 border-b border-white/5 bg-zinc-900/50">
                   <div className="flex items-center justify-between">
                     <div>
                        <DialogTitle className="text-2xl font-heading font-bold">{selectedChallenge.title}</DialogTitle>
                        <p className="text-muted-foreground text-sm mt-1">{selectedChallenge.description}</p>
                     </div>
                     {userProgress && (
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => resetChallenge(selectedChallenge.id)}>
                          <RefreshCcw className="h-4 w-4 mr-2" /> Reset
                        </Button>
                     )}
                   </div>
                 </DialogHeader>

                 <ScrollArea className="flex-1 p-6">
                   {!userProgress ? (
                     <div className="text-center py-12 space-y-4">
                       <Trophy className="h-16 w-16 text-primary mx-auto opacity-20" />
                       <h3 className="text-xl font-bold">Ready to start?</h3>
                       <p className="text-muted-foreground max-w-md mx-auto">
                         Commit to {selectedChallenge.durationDays} days of greatness. {selectedChallenge.startInstruction}
                       </p>
                       <Button size="lg" className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => startChallenge(selectedChallenge.id)}>
                         Start Challenge
                       </Button>
                     </div>
                   ) : (
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                       {selectedChallenge.dailyPlan.map((plan, i) => {
                         const dayNum = i + 1;
                         const isCompleted = userProgress.completedDays.includes(dayNum);
                         return (
                           <div 
                             key={i} 
                             className={cn(
                               "p-3 rounded-lg border cursor-pointer transition-all flex flex-col items-center text-center gap-2 min-h-[100px] justify-center",
                               isCompleted 
                                 ? "bg-primary/10 border-primary text-primary" 
                                 : "bg-secondary/30 border-white/5 hover:bg-secondary/50"
                             )}
                             onClick={() => toggleDay(selectedChallenge.id, dayNum)}
                           >
                             <div className="text-xs font-bold uppercase opacity-50">Day {dayNum}</div>
                             {isCompleted ? <CheckCircle className="h-6 w-6" /> : <div className="h-6 w-6 rounded-full border-2 border-white/20" />}
                             <div className="text-[10px] leading-tight text-muted-foreground">{plan}</div>
                           </div>
                         );
                       })}
                     </div>
                   )}
                 </ScrollArea>
               </>
             );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
