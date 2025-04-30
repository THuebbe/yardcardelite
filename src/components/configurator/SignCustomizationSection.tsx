"use client";

import React, { useEffect } from "react";
import { SignCustomization } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SignCustomizationSectionProps {
  signCustomization: SignCustomization;
  onSignCustomizationChange: (
    customization: Partial<SignCustomization>,
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

const eventMessageOptions = [
  "Happy Birthday",
  "Happy Anniversary",
  "Congratulations",
  "Welcome Home",
  "Just Married",
  "It's a Boy",
  "It's a Girl",
  "Graduation",
  "Custom",
];

const numberedEvents = ["Happy Birthday", "Happy Anniversary"];

const hobbyOptions = [
  "Sports",
  "Music",
  "Art",
  "Gaming",
  "Reading",
  "Cooking",
  "Gardening",
  "Fishing",
  "Cars",
  "Travel",
  "Photography",
  "Dancing",
  "Animals",
  "Science",
  "Technology",
  "Police/Fire",
];

const heroThemeOptions = [
  "Mario and Luigi",
  "Taylor Swift",
  "Ninja Turtles",
  "Sonic the Hedgehog",
  "X-Men",
  "Spider-Man",
  "Disney Princesses",
  "Star Wars",
  "Harry Potter",
  "Pokémon",
  "Avengers",
  "Barbie",
];

const getNumberSuffix = (num: number): string => {
  if (num >= 11 && num <= 13) return "th";

  const lastDigit = num % 10;
  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const SignCustomizationSection: React.FC<SignCustomizationSectionProps> = ({
  signCustomization,
  onSignCustomizationChange,
  onNext,
  onBack,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const isNumberedEvent = numberedEvents.includes(
    signCustomization.eventMessage || "",
  );

  useEffect(() => {
    // Set default backgroundColor and textColor to black if not set
    if (!signCustomization.backgroundColor) {
      onSignCustomizationChange({ backgroundColor: "black" });
    }
    if (!signCustomization.textColor) {
      onSignCustomizationChange({ textColor: "black" });
    }
  }, []);

  useEffect(() => {
    // Generate sign text based on event message, number, and recipient name
    if (signCustomization.eventMessage && signCustomization.recipientName) {
      let generatedText = "";

      if (isNumberedEvent && signCustomization.eventNumber) {
        const suffix = getNumberSuffix(signCustomization.eventNumber);
        const [first, second] = signCustomization.eventMessage.split(" ");
        generatedText = `${first} ${signCustomization.eventNumber}${suffix} ${second}\n${signCustomization.recipientName}`;
      } else if (signCustomization.eventMessage === "Custom") {
        generatedText = signCustomization.text || "Your Text Here";
      } else {
        generatedText = `${signCustomization.eventMessage}\n${signCustomization.recipientName}`;
      }

      onSignCustomizationChange({ text: generatedText });
    }
  }, [
    signCustomization.eventMessage,
    signCustomization.eventNumber,
    signCustomization.recipientName,
  ]);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-border max-h-[calc(100vh-200px)] overflow-y-auto"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Event Message</Label>
          <Select
            value={signCustomization.eventMessage || ""}
            onValueChange={(value) =>
              onSignCustomizationChange({ eventMessage: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an event message" />
            </SelectTrigger>
            <SelectContent>
              {eventMessageOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isNumberedEvent && (
          <div className="space-y-2">
            <Label htmlFor="eventNumber">Event Number</Label>
            <Input
              id="eventNumber"
              type="number"
              min="1"
              max="100"
              value={signCustomization.eventNumber || ""}
              onChange={(e) =>
                onSignCustomizationChange({
                  eventNumber: parseInt(e.target.value) || undefined,
                })
              }
              placeholder="Enter the number"
              required={isNumberedEvent}
            />
            {signCustomization.eventNumber && (
              <p className="text-sm text-muted-foreground">
                {signCustomization.eventNumber}
                {getNumberSuffix(signCustomization.eventNumber)}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="recipientName">Recipient Name</Label>
          <Input
            id="recipientName"
            value={signCustomization.recipientName || ""}
            onChange={(e) =>
              onSignCustomizationChange({ recipientName: e.target.value })
            }
            placeholder="Enter recipient name"
            required
          />
        </div>

        {signCustomization.eventMessage === "Custom" && (
          <div className="space-y-2">
            <Label htmlFor="text">Custom Sign Text</Label>
            <Input
              id="text"
              value={signCustomization.text}
              onChange={(e) =>
                onSignCustomizationChange({ text: e.target.value })
              }
              placeholder="Enter custom text for your sign"
              required={signCustomization.eventMessage === "Custom"}
            />
          </div>
        )}

        {/* Background color is always white for now */}

        <div className="space-y-2">
          <Label>Message Color</Label>
          <RadioGroup
            value={signCustomization.textColor}
            onValueChange={(value) =>
              onSignCustomizationChange({ textColor: value })
            }
            className="flex space-x-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="black" id="text-black" />
              <Label htmlFor="text-black" className="flex items-center">
                <div className="w-6 h-6 bg-black rounded-full mr-2"></div>
                Black
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blue" id="text-blue" />
              <Label htmlFor="text-blue" className="flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                Blue
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="red" id="text-red" />
              <Label htmlFor="text-red" className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full mr-2"></div>
                Red
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Name Color</Label>
          <RadioGroup
            value={signCustomization.backgroundColor || "black"}
            onValueChange={(value) =>
              onSignCustomizationChange({ backgroundColor: value })
            }
            className="flex space-x-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="black" id="name-black" />
              <Label htmlFor="name-black" className="flex items-center">
                <div className="w-6 h-6 bg-black rounded-full mr-2"></div>
                Black
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blue" id="name-blue" />
              <Label htmlFor="name-blue" className="flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                Blue
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="red" id="name-red" />
              <Label htmlFor="name-red" className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full mr-2"></div>
                Red
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="font-medium">Help us fill in the rest of the signs</h3>

          <div className="space-y-2">
            <Label htmlFor="heroTheme">Hero Theme</Label>
            <Select
              value={signCustomization.heroTheme || ""}
              onValueChange={(value) =>
                onSignCustomizationChange({ heroTheme: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a hero theme" />
              </SelectTrigger>
              <SelectContent>
                {heroThemeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 mb-8">
            <Label>Hobbies/Interests (for decorations)</Label>
            <div className="grid grid-cols-2 gap-2">
              {hobbyOptions.map((hobby) => (
                <div key={hobby} className="flex items-center space-x-2">
                  <Checkbox
                    id={`hobby-${hobby}`}
                    checked={(signCustomization.hobbies || []).includes(hobby)}
                    onCheckedChange={(checked) => {
                      const currentHobbies = [
                        ...(signCustomization.hobbies || []),
                      ];
                      if (checked) {
                        onSignCustomizationChange({
                          hobbies: [...currentHobbies, hobby],
                        });
                      } else {
                        onSignCustomizationChange({
                          hobbies: currentHobbies.filter(
                            (item) => item !== hobby,
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`hobby-${hobby}`}>{hobby}</Label>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button
                type="button"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium px-6 py-2 mt-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  // Generate functionality can be implemented here
                  alert("Generating decorations based on selected hobbies!");
                }}
              >
                Generate!
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default SignCustomizationSection;
