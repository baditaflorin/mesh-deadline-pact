import { useEffect, useState } from "react";
import {
  MeshNameInput,
  useDeadline,
  useNamedPeer,
  type MeshConfig,
  type YRoom,
} from "@baditaflorin/mesh-common";
export const validPact = (s: string) => s.trim().length >= 3 && s.trim().length <= 160;
type Pact = { text: string; deadline: number };
type Props = { room: YRoom | null; config: MeshConfig };
export function Feature({ room, config }: Props) {
  const named = useNamedPeer(config, room),
    [text, setText] = useState(""),
    [hours, setHours] = useState("24"),
    [rev, setRev] = useState(0);
  useEffect(() => {
    if (!room) return;
    const m = room.doc.getMap<unknown>("pact"),
      f = () => setRev((x) => x + 1);
    m.observe(f);
    return () => m.unobserve(f);
  }, [room]);
  void rev;
  const m = room?.doc.getMap<unknown>("pact"),
    pact = m?.get("value") as Pact | undefined,
    done = (m?.get("done") as Record<string, string> | undefined) ?? {},
    d = useDeadline(pact?.deadline ?? null),
    create = () => {
      const h = Number(hours);
      if (room && validPact(text) && h > 0 && h <= 720)
        room.doc
          .getMap("pact")
          .set("value", { text: text.trim(), deadline: Date.now() + h * 3600000 });
    },
    check = () => {
      if (room && pact && !done[room.peerId])
        room.doc.getMap("pact").set("done", { ...done, [room.peerId]: named.name || "Anonymous" });
    };
  return (
    <main className="pact">
      <h1>
        Make a pact.
        <br />
        Show up for it.
      </h1>
      {!pact ? (
        <section>
          <textarea
            aria-label="Commitment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write one clear commitment"
          />
          <input
            aria-label="Deadline hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <button onClick={create} disabled={!room || !validPact(text)}>
            Create shared pact
          </button>
        </section>
      ) : (
        <section>
          <p>{pact.text}</p>
          <strong aria-live="polite">{d.fmt} left</strong>
          <button onClick={check} disabled={!room || !!done[room?.peerId ?? ""]}>
            {done[room?.peerId ?? ""] ? "Your completion is recorded" : "I completed my pact"}
          </button>
          <ol>
            {Object.values(done).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ol>
          <MeshNameInput
            label="Display name"
            value={named.name}
            onChange={named.setName}
            placeholder="Name in this room"
            maxLength={32}
            showCounter
          />
        </section>
      )}
    </main>
  );
}
