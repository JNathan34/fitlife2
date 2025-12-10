import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FRIENDS, TRAINERS } from "@/lib/mockData";
import { useLocalStorage, Booking } from "@/lib/storage";
import { User, MessageCircle, Star, Calendar, UserPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function Community() {
  const [friends, setFriends] = useLocalStorage<number[]>("fw_friends", []);
  const [bookings, setBookings] = useLocalStorage<Booking[]>("fw_bookings", []);
  const [selectedTrainer, setSelectedTrainer] = useState<typeof TRAINERS[0] | null>(null);
  const { toast } = useToast();

  const addFriend = (id: number) => {
    if (friends.includes(id)) return;
    setFriends([...friends, id]);
    toast({ title: "Friend Added!" });
  };

  const bookTrainer = (trainer: typeof TRAINERS[0]) => {
    const booking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      trainerId: trainer.id,
      trainerName: trainer.name,
      date: new Date().toISOString(),
      time: "10:00 AM",
      notes: "Initial consultation"
    };
    setBookings([...bookings, booking]);
    toast({ title: "Session Booked!", description: `Booked with ${trainer.name}` });
    setSelectedTrainer(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Community</h1>
        <p className="text-muted-foreground">Connect with friends and book top-tier trainers.</p>
      </div>

      <Tabs defaultValue="trainers" className="w-full">
        <TabsList className="bg-muted border border-border p-1">
          <TabsTrigger value="trainers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Find Trainers</TabsTrigger>
          <TabsTrigger value="friends" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Find Friends</TabsTrigger>
          <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">My Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trainers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRAINERS.map((trainer) => (
              <Card key={trainer.id} className="bg-card border-border hover:border-primary/30 transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                   <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-2 border-primary">
                     <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover" />
                   </div>
                   <h3 className="text-xl font-bold text-foreground">{trainer.name}</h3>
                   <div className="flex items-center gap-1 text-yellow-500 my-1">
                     <Star className="h-4 w-4 fill-current" />
                     <span className="font-bold">{trainer.rating.toFixed(1)}</span>
                     <span className="text-muted-foreground text-xs">({trainer.reviewsCount} reviews)</span>
                   </div>
                   <div className="flex flex-wrap justify-center gap-2 my-3">
                     {trainer.specialties.map(s => (
                       <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                     ))}
                   </div>
                   <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{trainer.bio}</p>
                   <div className="mt-auto w-full">
                     <p className="text-xl font-bold text-foreground mb-3">${trainer.rate}<span className="text-sm text-muted-foreground font-normal">/hr</span></p>
                     <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setSelectedTrainer(trainer)}>
                       View Profile
                     </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {FRIENDS.map((friend) => (
              <Card key={friend.id} className="bg-card border-border">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="relative">
                    <img src={friend.avatar} alt={friend.name} className="h-12 w-12 rounded-full bg-zinc-800" />
                    {friend.online && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{friend.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{friend.interests.join(", ")}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => addFriend(friend.id)} disabled={friends.includes(friend.id)}>
                    {friends.includes(friend.id) ? <MessageCircle className="h-4 w-4 text-primary" /> : <UserPlus className="h-4 w-4" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No active bookings. Find a trainer to get started!</div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="bg-card border-border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground text-lg">Session with {booking.trainerName}</h4>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(booking.date).toLocaleDateString()}</span>
                        <span>{booking.time}</span>
                      </div>
                    </div>
                    <Badge className="bg-primary/20 text-primary">Confirmed</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Trainer Modal */}
      <Dialog open={!!selectedTrainer} onOpenChange={(open) => !open && setSelectedTrainer(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          {selectedTrainer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <img src={selectedTrainer.avatar} className="h-16 w-16 rounded-full border-2 border-primary" />
                  <div>
                    <DialogTitle className="text-2xl">{selectedTrainer.name}</DialogTitle>
                    <p className="text-primary font-bold">${selectedTrainer.rate}/hr</p>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedTrainer.bio}</p>
                <div>
                  <h4 className="font-bold mb-2">Certifications</h4>
                  <div className="flex gap-2">
                    {selectedTrainer.certifications.map(c => (
                      <Badge key={c} variant="outline">{c}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Availability</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTrainer.availability.map(a => (
                      <Button key={a} variant="outline" className="text-xs" onClick={() => bookTrainer(selectedTrainer)}>
                        {a}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
