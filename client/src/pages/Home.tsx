import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QUOTES, WORKOUTS, WELLNESS_TIPS } from "@/lib/mockData";
import { useLocalStorage } from "@/lib/storage";
import { ArrowRight, Flame, Timer, Trophy, Droplets, Play, ChevronRight, Activity } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import heroImage from "@assets/generated_images/dark_moody_gym_atmosphere_with_neon_lighting.png";

export default function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  useEffect(() => {
    // Rotate quotes every time component mounts or just pick random
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
  }, []);

  const featuredWorkout = WORKOUTS[0];

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full rounded-3xl overflow-hidden group shadow-2xl border border-white/5">
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        <img 
          src={heroImage} 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-12 max-w-3xl">
          <div className="mb-6 space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider mb-2">
              Daily Challenge
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-[0.9] drop-shadow-lg">
              UNLEASH YOUR <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">FULL POTENTIAL</span>
            </h1>
            <p className="text-lg text-gray-200 max-w-xl mt-4 font-light">
              Your journey to greatness starts with a single rep. Join the 30-day transformation challenge today.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/workouts">
              <Button size="lg" className="h-14 px-8 text-lg font-bold uppercase tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-[0_0_20px_rgba(132,204,22,0.4)] hover:shadow-[0_0_30px_rgba(132,204,22,0.6)] transition-all">
                Start Workout
              </Button>
            </Link>
            <Link href="/meals">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold uppercase tracking-wide bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md rounded-full">
                View Meal Plan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Workouts", value: "12", sub: "This month", icon: Flame, color: "text-orange-500" },
          { label: "Calories", value: "14.5k", sub: "Burned total", icon: Activity, color: "text-red-500" },
          { label: "Active Days", value: "5", sub: "Current streak", icon: Trophy, color: "text-yellow-500" },
          { label: "Water", value: "1.2L", sub: "Today", icon: Droplets, color: "text-blue-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-colors group">
            <CardContent className="p-6 flex flex-col items-center text-center md:items-start md:text-left">
              <div className={`p-3 rounded-2xl bg-muted mb-4 group-hover:bg-muted/80 transition-colors ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-heading font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide text-[10px]">{stat.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Motivation Widget */}
        <Card className="lg:col-span-2 border-border bg-gradient-to-br from-card to-card/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full block" />
              Daily Motivation
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <blockquote className="text-2xl md:text-3xl font-heading font-medium text-foreground leading-tight mb-6">
              "{QUOTES[quoteIndex]}"
            </blockquote>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setQuoteIndex((prev) => (prev + 1) % QUOTES.length)}>
                  New Quote
                </Button>
              </div>
              <Link href="/challenges">
                 <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 group">
                  View Challenges <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action: Random Workout */}
        <Card className="border-border bg-card group cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('/assets/placeholders/noise.png')] opacity-5 pointer-events-none" />
           <img 
              src={featuredWorkout.thumbnail} 
              alt="Workout" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity"
              onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80')}
            />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
           
           <CardContent className="relative z-10 h-full flex flex-col justify-end p-6">
             <div className="mb-auto pt-4">
                <span className="px-2 py-1 rounded bg-background/50 backdrop-blur text-[10px] uppercase font-bold text-foreground border border-border">
                  Featured
                </span>
             </div>
             
             <h3 className="text-xl font-heading font-bold text-foreground mb-2 line-clamp-2">
               {featuredWorkout.title}
             </h3>
             
             <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
               <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {featuredWorkout.durationMin}m</span>
               <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {featuredWorkout.caloriesEstimate} kcal</span>
             </div>
             
             <Button className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold">
               <Play className="h-4 w-4 mr-2 fill-current" /> Start Now
             </Button>
           </CardContent>
        </Card>
      </div>

      {/* Wellness Tips Row */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground">Wellness Tips</h2>
          <Button variant="link" className="text-muted-foreground hover:text-foreground">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {WELLNESS_TIPS.map((tip) => (
            <Card key={tip.id} className="bg-card border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{tip.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
