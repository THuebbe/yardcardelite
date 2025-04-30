import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  // This would be fetched from the database in a real implementation
  const profile = {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone_number: "(555) 123-4567",
    company_name: "YardCard Elite",
    address: "123 Main St",
    city: "Austin",
    state: "TX",
    zip_code: "78701",
    country: "United States",
    website: "https://example.com",
    timezone: "America/Chicago",
  };

  return (
    <div className="container max-w-4xl py-10 bg-background">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Link href="/profile/edit">
          <Button>Edit Profile</Button>
        </Link>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {profile.first_name?.[0]}
              {profile.last_name?.[0]}
            </div>
            <div>
              <CardTitle className="text-2xl">
                {profile.first_name} {profile.last_name}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {profile.company_name}
              </p>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">
                  Email:
                </span>
                <span>{profile.email}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">
                  Phone:
                </span>
                <span>{profile.phone_number}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">
                  Website:
                </span>
                <span>{profile.website}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">
                  Street:
                </span>
                <span>{profile.address}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">City:</span>
                <span>{profile.city}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">
                  State:
                </span>
                <span>{profile.state}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">
                  Zip Code:
                </span>
                <span>{profile.zip_code}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">
                  Country:
                </span>
                <span>{profile.country}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">
                  Timezone:
                </span>
                <span>{profile.timezone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
