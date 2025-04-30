"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Link as LinkIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ConfiguratorLinkProps {
  agencyCode: string;
}

export default function ConfiguratorLink({
  agencyCode,
}: ConfiguratorLinkProps) {
  const [copied, setCopied] = useState(false);

  // Generate the unique link with the agency code as a parameter
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const configuratorLink = `${baseUrl}/configurator/${agencyCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(configuratorLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon size={18} className="text-primary" />
          Your Configurator Link
        </CardTitle>
        <CardDescription>
          Insert this link into your website as the link for your "Book Now"
          button
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Input
              value={configuratorLink}
              readOnly
              className="font-mono text-sm flex-1"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              When customers use this link, the configurator will be associated
              with your account.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
