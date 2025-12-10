import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage, DailyStats } from "@/lib/storage";
import { Activity, Droplets, TrendingUp, Scale, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid } from "recharts";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Tracker() {
  const [trackerData, setTrackerData] = useLocalStorage<Record<string, DailyStats>>("fw_tracker_data", {});
  const { toast } = useToast();
  
  const today = new Date().toISOString().split('T')[0];
  const currentStats = trackerData[today] || { steps: 0, calories: 0, water: 0, weight: 0, workoutsLogged: [] };

  const [inputOpen, setInputOpen] = useState(false);
  const [inputType, setInputType] = useState<'steps' | 'weight' | 'water'>('steps');
  const [inputValue, setInputValue] = useState("");

  const updateStat = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;

    const newData = { ...currentStats };
    
    if (inputType === 'steps') newData.steps = (newData.steps || 0) + val;
    if (inputType === 'weight') newData.weight = val; // Replace weight
    if (inputType === 'water') newData.water = (newData.water || 0) + val;

    setTrackerData({
      ...trackerData,
      [today]: newData
    });
    
    toast({ title: "Updated!" });
    setInputOpen(false);
    setInputValue("");
  };

  // Prepare Chart Data (Last 7 days)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayData = trackerData[dateStr] || { steps: 0, calories: 0, weight: 0 };
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      steps: dayData.steps,
      calories: dayData.calories,
      weight: dayData.weight || null
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Progress Tracker</h1>
          <p className="text-muted-foreground">Visualize your journey.</p>
        </div>
        <div className="flex gap-2">
           <Button onClick={() => { setInputType('steps'); setInputOpen(true); }} variant="outline" className="gap-2 border-border">
             <Activity className="h-4 w-4" /> Log Steps
           </Button>
           <Button onClick={() => { setInputType('weight'); setInputOpen(true); }} variant="outline" className="gap-2 border-border">
             <Scale className="h-4 w-4" /> Log Weight
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart - Steps & Calories */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-muted/20" vertical={false} />
                  <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  />
                  <Bar dataKey="steps" name="Steps" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="calories" name="Calories" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stats Column */}
        <div className="space-y-6">
          {/* Water Tracker */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
            <CardContent className="p-6 text-center relative z-10">
               <div className="mx-auto bg-blue-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-blue-500 dark:text-blue-400">
                 <Droplets className="h-8 w-8" />
               </div>
               <h3 className="text-2xl font-bold text-foreground mb-1">{currentStats.water?.toFixed(1) || 0} <span className="text-sm font-normal text-muted-foreground">/ 3.0 L</span></h3>
               <p className="text-xs text-blue-600 dark:text-blue-300 mb-4">Daily Hydration</p>
               
               <Progress value={((currentStats.water || 0) / 3) * 100} className="h-2 bg-blue-200 dark:bg-blue-950 mb-6" />
               
               <div className="flex justify-center gap-2">
                 <Button size="sm" variant="outline" className="h-8 border-blue-300 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300" onClick={() => {
                   setTrackerData({ ...trackerData, [today]: { ...currentStats, water: (currentStats.water || 0) + 0.25 } });
                   toast({ title: "Hydrated!" });
                 }}>
                   <Plus className="h-3 w-3 mr-1" /> 250ml
                 </Button>
                 <Button size="sm" variant="outline" className="h-8 border-blue-300 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300" onClick={() => {
                   setTrackerData({ ...trackerData, [today]: { ...currentStats, water: (currentStats.water || 0) + 0.5 } });
                   toast({ title: "Hydrated!" });
                 }}>
                   <Plus className="h-3 w-3 mr-1" /> 500ml
                 </Button>
               </div>
            </CardContent>
          </Card>

          {/* Weight Widget */}
          <Card className="bg-card border-border">
             <CardHeader>
               <CardTitle className="text-sm font-medium">Weight History</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.filter(d => d.weight)}>
                      <XAxis dataKey="name" hide />
                      <YAxis domain={['auto', 'auto']} hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                      />
                      <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* Input Modal */}
      <Dialog open={inputOpen} onOpenChange={setInputOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="capitalize">Log {inputType}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Value</Label>
              <Input 
                type="number" 
                placeholder={inputType === 'steps' ? "e.g. 5000" : inputType === 'weight' ? "e.g. 75.5" : "e.g. 0.5"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">
                {inputType === 'steps' ? "Steps walked" : inputType === 'weight' ? "Current weight in kg" : "Water in Liters"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={updateStat}>Save Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
