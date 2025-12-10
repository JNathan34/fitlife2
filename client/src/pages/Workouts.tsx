import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { WORKOUTS } from "@/lib/mockData";
import { useLocalStorage } from "@/lib/storage";
import { Search, Clock, Flame, Dumbbell, PlayCircle, Heart, Activity, Shuffle, Info, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Workouts() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedWorkout, setSelectedWorkout] = useState<typeof WORKOUTS[0] | null>(null);
  
  // Local Storage
  const [favorites, setFavorites] = useLocalStorage<number[]>("fw_favorites_workouts", []);
  const [trackerData, setTrackerData] = useLocalStorage<Record<string, any>>("fw_tracker_data", {});
  
  const { toast } = useToast();
  
  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fid => fid !== id));
      toast({ title: "Removed from favorites" });
    } else {
      setFavorites([...favorites, id]);
      toast({ title: "Added to favorites" });
    }
  };

  const logWorkout = () => {
    if (!selectedWorkout) return;
    
    const today = new Date().toISOString().split('T')[0];
    const currentData = trackerData[today] || { steps: 0, calories: 0, water: 0, weight: 0, workoutsLogged: [] };
    
    setTrackerData({
      ...trackerData,
      [today]: {
        ...currentData,
        calories: (currentData.calories || 0) + selectedWorkout.caloriesEstimate,
        workoutsLogged: [...(currentData.workoutsLogged || []), selectedWorkout.id]
      }
    });
    
    toast({ title: "Workout Logged!", description: `+${selectedWorkout.caloriesEstimate} kcal added to today's total.` });
    setSelectedWorkout(null);
  };

  const pickRandomWorkout = () => {
    const random = WORKOUTS[Math.floor(Math.random() * WORKOUTS.length)];
    setSelectedWorkout(random);
  };

  const filteredWorkouts = WORKOUTS.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || w.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Workout Library</h1>
          <p className="text-muted-foreground">Browse {WORKOUTS.length} premium workouts.</p>
        </div>

        <div className="bg-card/80 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center shadow-lg backdrop-blur-xl sticky top-0 z-10 transition-colors">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search workouts..." 
              className="pl-9 bg-background border-white/10 focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48 bg-background border-white/10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {Array.from(new Set(WORKOUTS.map(w => w.category))).map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={pickRandomWorkout}
          >
            <Shuffle className="h-4 w-4 mr-2" /> Random Workout
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWorkouts.map((workout) => (
          <Card 
            key={workout.id} 
            className="group border-white/5 bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
            onClick={() => setSelectedWorkout(workout)}
          >
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img 
                src={workout.thumbnail} 
                alt={workout.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => (e.currentTarget.src = `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60`)}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <PlayCircle className="h-12 w-12 text-primary fill-current" />
              </div>
              <div className="absolute top-2 right-2 z-20">
                 <Button 
                  size="icon" 
                  variant="ghost" 
                  className={`h-8 w-8 rounded-full backdrop-blur-md ${favorites.includes(workout.id) ? 'text-red-500 bg-white/10' : 'text-white/50 bg-black/20 hover:text-red-500 hover:bg-black/40'}`}
                  onClick={(e) => toggleFavorite(workout.id, e)}
                 >
                   <Heart className={`h-4 w-4 ${favorites.includes(workout.id) ? 'fill-current' : ''}`} />
                 </Button>
              </div>
              <div className="absolute bottom-2 left-2 flex gap-2">
                <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm border-none text-[10px] uppercase tracking-wider font-bold">
                  {workout.category}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col">
              <h3 className="font-heading text-lg font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {workout.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-4">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {workout.durationMin}m</span>
                <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" /> {workout.caloriesEstimate}</span>
                <span className="flex items-center gap-1"><Dumbbell className="h-3.5 w-3.5" /> {workout.difficulty}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedWorkout} onOpenChange={(open) => !open && setSelectedWorkout(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col bg-card border-white/5 text-foreground p-0 overflow-hidden sm:rounded-xl">
          {selectedWorkout && (
            <>
              <div className="relative aspect-video w-full shrink-0">
                 <img 
                  src={selectedWorkout.thumbnail} 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60`)}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                 <div className="absolute bottom-0 left-0 p-6">
                   <Badge className="mb-2 bg-primary text-primary-foreground">{selectedWorkout.category}</Badge>
                   <DialogTitle className="text-2xl md:text-3xl font-heading font-bold text-foreground">{selectedWorkout.title}</DialogTitle>
                 </div>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">
                  {/* Stats Bar */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-border pb-4">
                    <div className="flex flex-col items-center">
                      <Clock className="h-5 w-5 mb-1 text-primary" />
                      <span>{selectedWorkout.durationMin} min</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Flame className="h-5 w-5 mb-1 text-orange-500" />
                      <span>{selectedWorkout.caloriesEstimate} kcal</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Activity className="h-5 w-5 mb-1 text-blue-500" />
                      <span>{selectedWorkout.difficulty}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Dumbbell className="h-5 w-5 mb-1 text-purple-500" />
                      <span>{selectedWorkout.equipment}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-lg mb-2 text-foreground">Description</h4>
                        <p className="text-muted-foreground leading-relaxed">{selectedWorkout.description}</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-lg mb-2 text-foreground">Target Muscles</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedWorkout.muscles.map(m => (
                            <Badge key={m} variant="outline" className="border-border text-foreground">{m}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                         <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-primary">
                           <Info className="h-4 w-4" /> Pro Tips
                         </h4>
                         <ul className="space-y-2">
                           {selectedWorkout.tips.map((tip, i) => (
                             <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                               <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                               {tip}
                             </li>
                           ))}
                         </ul>
                      </div>
                    </div>

                    <div className="space-y-6">
                       <div>
                         <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                           <Activity className="h-5 w-5 text-primary" /> Instructions
                         </h4>
                         <div className="space-y-4">
                           {selectedWorkout.steps.map((step, i) => (
                             <div key={i} className="flex gap-3">
                               <div className="flex flex-col items-center gap-1">
                                 <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground shrink-0">
                                   {i + 1}
                                 </div>
                                 {i !== selectedWorkout.steps.length - 1 && <div className="w-0.5 h-full bg-border" />}
                               </div>
                               <p className="text-sm text-muted-foreground pt-0.5 pb-4">{step}</p>
                             </div>
                           ))}
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="p-6 pt-0 pb-6 bg-card shrink-0">
                <Button variant="outline" className="w-full border-border hover:bg-muted" onClick={() => setSelectedWorkout(null)}>Close</Button>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={logWorkout}>
                   Log Workout
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
