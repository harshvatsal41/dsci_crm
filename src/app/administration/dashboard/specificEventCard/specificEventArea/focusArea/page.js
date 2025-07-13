import { useRouter } from "next/navigation";

export default function FocusArea() {
    const router = useRouter();
    const eventId = router.query.id;
    alert("HI")
    return (
        <div>
            <h1>Focus Area {eventId}</h1>
        </div>
    );
}
