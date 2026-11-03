export const recording = { status: 200, body: { id: 1042, status: 'confirmed', total: 49 } };
export const scenarios = {
  same: { status: 200, body: { id: 1042, status: 'confirmed', total: 49 } },
  changed: { status: 200, body: { id: 1042, status: 'pending', total: 54 } },
  error: { status: 503, body: { error: 'Service unavailable' } }
};

// The demo compares HTTP status and top-level JSON fields in its fixed fixtures.
export function compareResponses(source, target) {
  const differences = [];
  if (source.status !== target.status) differences.push(`HTTP status: ${source.status} → ${target.status}`);
  const fields = new Set([...Object.keys(source.body), ...Object.keys(target.body)]);
  for (const key of fields) {
    const before = source.body[key];
    const after = target.body[key];
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      differences.push(`${key}: ${before === undefined ? '(missing)' : JSON.stringify(before)} → ${after === undefined ? '(missing)' : JSON.stringify(after)}`);
    }
  }
  return differences;
}
