import React, { useRef } from "react";
import { EventDetails } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventDetailsSectionProps {
  eventDetails: EventDetails;
  onEventDetailsChange: (details: Partial<EventDetails>) => void;
  onNext: () => void;
  onBack: () => void;
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  eventDetails,
  onEventDetailsChange,
  onNext,
  onBack,
}) => {
  const popoverRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-border"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eventDate">Event Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                ref={popoverRef}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !eventDetails.eventDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {eventDetails.eventDate ? (
                  format(eventDetails.eventDate, "PPP")
                ) : (
                  <span>Select event date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={eventDetails.eventDate}
                onSelect={(date) => {
                  onEventDetailsChange({ eventDate: date });
                  // Close the popover after selection
                  popoverRef.current?.click();
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Delivery Address</h3>

          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              value={eventDetails.street || ""}
              onChange={(e) => onEventDetailsChange({ street: e.target.value })}
              placeholder="Enter street address"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={eventDetails.city || ""}
                onChange={(e) => onEventDetailsChange({ city: e.target.value })}
                placeholder="Enter city"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={eventDetails.state || ""}
                onChange={(e) =>
                  onEventDetailsChange({ state: e.target.value })
                }
                placeholder="Enter state"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">Zip Code</Label>
            <Input
              id="zip"
              value={eventDetails.zip || ""}
              onChange={(e) => onEventDetailsChange({ zip: e.target.value })}
              placeholder="Enter zip code"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="installationTime">Preferred Installation Time</Label>
          <Select
            value={eventDetails.installationTime}
            onValueChange={(value) =>
              onEventDetailsChange({
                installationTime: value as "morning" | "afternoon" | "evening",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select preferred time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
              <SelectItem value="evening">Evening (4PM - 7PM)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default EventDetailsSection;
