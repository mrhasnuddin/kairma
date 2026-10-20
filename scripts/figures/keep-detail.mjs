// Intro square · a close look at the treasury door: the temple key in its
// escutcheon, the studded bronze leaves and the inscribed lintel. Same geometry
// as Fig. 01, framed tight and clipped.
import { k, part, figure } from "./common.mjs";
import { BODY, DOOR, FACE_Y, KEY, cabinet, capAndPosts, door, key } from "./keep.mjs";

export async function build() {
  const W = 520;
  const H = 520;
  const P = k.fitProjection(
    [[DOOR.x - 10, FACE_Y, DOOR.z0 + 8], [DOOR.x + DOOR.w + 6, FACE_Y, DOOR.z1 + 10], [KEY.x, FACE_Y + KEY.len + 4, KEY.z], [BODY.x + BODY.w, BODY.y + BODY.d, 60]],
    W, H, { pad: 8, azimuth: 26, elevation: 24 },
  );
  const body = [cabinet(P), capAndPosts(P), door(P), part("key", key(P))];
  return { svg: figure({ width: W, height: H, body, clip: true }), meta: {} };
}
