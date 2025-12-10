import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MEALS } from "@/lib/mockData";
import { useLocalStorage } from "@/lib/storage";
import { Clock, Flame, Plus, Heart, ChefHat, Utensils, Info, Trash2, CalendarDays } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Meals() {
  const [favorites, setFavorites] = useLocalStorage<number[]>("fw_favorites_meals", []);
  const [mealPlan, setMealPlan] = useLocalStorage<typeof MEALS>("fw_meal_plan", []);
  const [selectedMeal, setSelectedMeal] = useState<typeof MEALS[0] | null>(null);
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

  const addToMealPlan = (meal: typeof MEALS[0]) => {
    if (mealPlan.some(m => m.id === meal.id)) {
      toast({ title: "Already in meal plan", variant: "destructive" });
      return;
    }
    setMealPlan([...mealPlan, meal]);
    toast({ title: "Added to meal plan" });
    setSelectedMeal(null);
  };

  const removeFromMealPlan = (id: number) => {
    setMealPlan(mealPlan.filter(m => m.id !== id));
    toast({ title: "Removed from meal plan" });
  };

  const calculateTotalMacros = () => {
    return mealPlan.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.macros.protein,
      carbs: acc.carbs + meal.macros.carbs,
      fat: acc.fat + meal.macros.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totals = calculateTotalMacros();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold text-white mb-2">Nutrition & Meals</h1>
        <p className="text-muted-foreground">Healthy recipes to fuel your gains.</p>
      </div>

      {mealPlan.length > 0 && (
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-heading flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Your Meal Plan
              </CardTitle>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span><span className="font-bold text-white">{totals.calories}</span> cal</span>
                <span><span className="font-bold text-blue-400">{totals.protein}g</span> P</span>
                <span><span className="font-bold text-green-400">{totals.carbs}g</span> C</span>
                <span><span className="font-bold text-yellow-400">{totals.fat}g</span> F</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full pb-4">
              <div className="flex gap-4">
                {mealPlan.map((meal) => (
                  <div key={meal.id} className="relative group min-w-[200px] w-[200px] bg-secondary/20 rounded-lg overflow-hidden border border-white/5">
                    <div className="h-32 w-full relative">
                      <img src={meal.image} className="w-full h-full object-cover" alt={meal.title} />
                      <button 
                        onClick={() => removeFromMealPlan(meal.id)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-full text-white transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-sm truncate mb-1">{meal.title}</h4>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{meal.calories} cal</span>
                        <span>{meal.macros.protein}g P</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MEALS.map((meal) => (
          <Card 
            key={meal.id} 
            className="group bg-card border-white/5 hover:border-primary/30 transition-all overflow-hidden cursor-pointer"
            onClick={() => setSelectedMeal(meal)}
          >
            <div className="relative aspect-square overflow-hidden">
               <img 
                 src={meal.image} 
                 alt={meal.title} 
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80')}
               />
               <div className="absolute top-2 right-2">
                 <Button 
                   size="icon" 
                   variant="secondary" 
                   className={`h-8 w-8 rounded-full shadow-lg ${favorites.includes(meal.id) ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 text-black hover:bg-white'}`}
                   onClick={(e) => toggleFavorite(meal.id, e)}
                 >
                   <Heart className={`h-4 w-4 ${favorites.includes(meal.id) ? 'fill-current' : ''}`} />
                 </Button>
               </div>
               <div className="absolute bottom-2 left-2">
                 <Badge className="bg-black/60 backdrop-blur hover:bg-black/70 border-none">{meal.category}</Badge>
               </div>
            </div>
            <CardContent className="p-4">
               <div className="flex flex-wrap gap-2 mb-3">
                 {meal.tags.map(tag => (
                   <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-medium uppercase">{tag}</span>
                 ))}
               </div>
               <h3 className="font-heading font-bold text-lg text-white mb-1 line-clamp-1">{meal.title}</h3>
               <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                 <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {meal.prepTimeMin}m</span>
                 <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {meal.calories}</span>
                 <span className="flex items-center gap-1 font-bold text-primary">P: {meal.macros.protein}g</span>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recipe Modal */}
      <Dialog open={!!selectedMeal} onOpenChange={(open) => !open && setSelectedMeal(null)}>
        <DialogContent className="max-w-2xl bg-card border-white/10 text-white p-0 overflow-hidden">
          {selectedMeal && (
            <>
              <div className="relative aspect-[21/9] w-full">
                 <img 
                  src={selectedMeal.image} 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80')}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                 <div className="absolute bottom-0 left-0 p-6">
                   <DialogTitle className="text-3xl font-heading font-bold">{selectedMeal.title}</DialogTitle>
                 </div>
              </div>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="p-6 space-y-8">
                  {/* Macros */}
                  <div className="grid grid-cols-4 gap-4 p-4 bg-secondary/30 rounded-xl border border-white/5">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{selectedMeal.calories}</p>
                      <p className="text-xs text-muted-foreground uppercase">Calories</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{selectedMeal.macros.protein}g</p>
                      <p className="text-xs text-muted-foreground uppercase">Protein</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{selectedMeal.macros.carbs}g</p>
                      <p className="text-xs text-muted-foreground uppercase">Carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">{selectedMeal.macros.fat}g</p>
                      <p className="text-xs text-muted-foreground uppercase">Fats</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-primary" /> Ingredients
                      </h4>
                      <ul className="space-y-2">
                        {selectedMeal.ingredients.map((ing, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <ChefHat className="h-5 w-5 text-primary" /> Instructions
                      </h4>
                      <ol className="space-y-4">
                        {selectedMeal.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-gray-300">
                            <span className="font-bold text-primary shrink-0">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="p-6 pt-0 bg-card">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" onClick={() => setSelectedMeal(null)}>Close</Button>
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => selectedMeal && addToMealPlan(selectedMeal)}
                >
                   Add to Plan
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
