import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage, defaultProfile, UserProfile } from "@/lib/storage";
import { User, Settings, Save, Camera, Heart, Trash2, PlayCircle, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";
import { WORKOUTS, MEALS } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const [profile, setProfile] = useLocalStorage<UserProfile>("fw_user_profile", defaultProfile);
  const [favWorkouts, setFavWorkouts] = useLocalStorage<number[]>("fw_favorites_workouts", []);
  const [favMeals, setFavMeals] = useLocalStorage<number[]>("fw_favorites_meals", []);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setProfile(profile);
    toast({
      title: "Profile Updated",
      description: "Your settings have been saved locally.",
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatarDataUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFavWorkout = (id: number) => {
    setFavWorkouts(favWorkouts.filter(fid => fid !== id));
    toast({ title: "Removed from favorites" });
  };

  const removeFavMeal = (id: number) => {
    setFavMeals(favMeals.filter(fid => fid !== id));
    toast({ title: "Removed from favorites" });
  };

  const favoritedWorkoutsList = WORKOUTS.filter(w => favWorkouts.includes(w.id));
  const favoritedMealsList = MEALS.filter(m => favMeals.includes(m.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-heading font-bold text-white">My Profile</h1>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Column */}
        <div className="space-y-6">
           <Card className="border-white/5 bg-card">
             <CardContent className="p-6 flex flex-col items-center text-center">
               <div 
                 className="relative mb-4 group cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}
               >
                 <div className="h-32 w-32 rounded-full bg-zinc-800 border-4 border-primary/20 overflow-hidden flex items-center justify-center">
                   {profile.avatarDataUrl ? (
                     <img src={profile.avatarDataUrl} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <User className="h-12 w-12 text-muted-foreground" />
                   )}
                 </div>
                 <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera className="h-6 w-6 text-white" />
                 </div>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept="image/*"
                   onChange={handleAvatarUpload}
                 />
               </div>
               <h2 className="text-xl font-bold text-white mb-1">{profile.name || "Guest User"}</h2>
               <p className="text-sm text-muted-foreground">{profile.goal}</p>
             </CardContent>
           </Card>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-white/5 bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" /> Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={profile.name} 
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="bg-background border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about">About Me</Label>
                <textarea 
                  id="about" 
                  value={profile.about}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input 
                    id="height" 
                    type="number"
                    value={profile.height} 
                    onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) || 0 })}
                    className="bg-background border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input 
                    id="weight" 
                    type="number"
                    value={profile.weight} 
                    onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) || 0 })}
                    className="bg-background border-white/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-current" /> My Favorites
        </h2>
        
        <Tabs defaultValue="workouts" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 w-full md:w-auto p-1 mb-6">
            <TabsTrigger value="workouts" className="flex-1 md:flex-none px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Workouts ({favWorkouts.length})</TabsTrigger>
            <TabsTrigger value="meals" className="flex-1 md:flex-none px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Meal Plans ({favMeals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="workouts">
            {favoritedWorkoutsList.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No favorite workouts yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoritedWorkoutsList.map(workout => (
                  <Card key={workout.id} className="border-white/5 bg-card overflow-hidden group">
                    <div className="relative h-32">
                      <img 
                        src={workout.thumbnail} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60`)}
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFavWorkout(workout.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-white line-clamp-1 mb-1">{workout.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] h-5">{workout.category}</Badge>
                        <span>{workout.durationMin} min</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="meals">
            {favoritedMealsList.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No favorite meals yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoritedMealsList.map(meal => (
                  <Card key={meal.id} className="border-white/5 bg-card overflow-hidden group">
                    <div className="relative h-32">
                      <img 
                        src={meal.image} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80')}
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFavMeal(meal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-white line-clamp-1 mb-1">{meal.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] h-5">{meal.category}</Badge>
                        <span>{meal.calories} kcal</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
