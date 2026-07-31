import { createFileRoute } from "@tanstack/react-router";
import { Interview } from "@/components/interview";

export const Route = createFileRoute("/interview/$interviewId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { interviewId } = Route.useParams();

  return <Interview interviewId={interviewId} />;
}