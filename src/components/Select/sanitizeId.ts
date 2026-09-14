/** Makes a flat-item key ("option:42", "group:Fruit") safe to use as (part of) an HTML id. */
export function sanitizeId(key: string): string {
    return key.replace(/[^a-zA-Z0-9_-]/g, "-");
}
