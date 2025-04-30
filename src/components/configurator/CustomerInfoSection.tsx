import React from "react";
import { CustomerInfo } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerInfoSectionProps {
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: Partial<CustomerInfo>) => void;
  onNext: () => void;
  onBack?: () => void;
}

const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  customerInfo,
  onCustomerInfoChange,
  onNext,
  onBack,
}) => {
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
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={customerInfo.name}
            onChange={(e) => onCustomerInfoChange({ name: e.target.value })}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => onCustomerInfoChange({ email: e.target.value })}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => onCustomerInfoChange({ phone: e.target.value })}
            placeholder="Enter your phone number"
            required
          />
        </div>
      </div>

      <div className="flex justify-between">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default CustomerInfoSection;
