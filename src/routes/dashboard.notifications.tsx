import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Button, Card, EmptyState, NotificationItem, PageHeader } from "@/components/app/ui";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => seo("Notifications", "Alerts about consumption, payments and device changes."),
  component: Notifications,
});

function Notifications() {
  const { notifications, unread, markRead, markAllRead, removeNotification } = useStore();
  return (
    <>
      <PageHeader title="Notifications" description={`${unread} unread`} actions={<Button variant="outline" size="sm" onClick={markAllRead} disabled={!unread}>Mark all as read</Button>} />
      <Card className="space-y-3">
        {notifications.length === 0 ? <EmptyState icon={<Bell />} title="You're all caught up" description="New alerts will appear here." /> :
          notifications.map((n) => <NotificationItem key={n.id} n={n} onRead={() => markRead(n.id)} onRemove={() => removeNotification(n.id)} />)}
      </Card>
    </>
  );
}
