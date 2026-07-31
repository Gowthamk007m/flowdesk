export default function DashboardHeader() {
    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 18
            ? "Good afternoon"
            : "Good evening";

    return (
        <section className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
                {greeting}, Gowtham 👋
            </h1>

            <p className="text-muted-foreground">
                Here's what's happening with your cases today.
            </p>
        </section>
    );
}