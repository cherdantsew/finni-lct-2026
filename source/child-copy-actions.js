// Last layer. Keep aligned with the exact transform installed in Figma.
for (const k of Object.keys(A)) A[k] = childCopy(A[k]);
for (const k of Object.keys(enter)) enter[k] = childCopy(enter[k]);

