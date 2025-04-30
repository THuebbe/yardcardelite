import ConfiguratorLink from "@/components/configurator/ConfiguratorLink";

export default function BookingLinkPage() {
  // This is a dummy const to simulate fetching the agency code from the database
  // In the future, this will be fetched from the database based on the logged-in user
  const agencyCode = "YCE12345";

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Your Configurator Link
        </h2>
      </div>
      <p className="text-muted-foreground">
        Share this unique link with your customers to let them configure their
        yard signs
      </p>

      {/* Configurator Link Section */}
      <section className="mt-6">
        <ConfiguratorLink agencyCode={agencyCode} />
      </section>
    </main>
  );
}
