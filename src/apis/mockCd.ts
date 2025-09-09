
const COVERS = 13;

function generateMockCds(total = 60): CDRackItem[] {
  const list: CDRackItem[] = [];
  for (let i = 0; i < total; i++) {
    const id = 10000 + i;
    list.push({
      myCdId: id,
      title: `Demo Title ${i + 1}`,
      artist: `Demo Artist ${((i % 5) + 1)}`,
      album: `Demo Album ${Math.floor(i / 5) + 1}`,
      releaseDate: `20${10 + (i % 15)}-0${(i % 9) + 1}-15`,
      genres: ['pop', i % 2 ? 'indie' : 'electro'],
      coverUrl: `/covers/${(i % COVERS) + 1}.jpg`,
      youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
      duration: 180 + (i % 120),
    });
  }
  return list;
}

const MOCK_DB = new Map<number, CDRackItem[]>();

function getUserList(targetUserId: number) {
  if (!MOCK_DB.has(targetUserId)) {
    MOCK_DB.set(targetUserId, generateMockCds(48 + (targetUserId % 12)));
  }
  return MOCK_DB.get(targetUserId)!;
}

export async function mockGetCdRack(
  targetUserId: number,
  size = 14,
  cursor?: number
): Promise<CDRackInfo> {
  const all = getUserList(targetUserId);

  let startIdx = 0;
  if (typeof cursor === 'number') {
    const idx = all.findIndex((c) => c.myCdId === cursor);
    startIdx = idx >= 0 ? idx + 1 : 0;
  }

  const page = all.slice(startIdx, startIdx + size);
  const last = page[page.length - 1];
  const nextCursor = last ? last.myCdId : 0;

  return {
    data: page,
    nextCursor,                  
    totalCount: all.length,
    firstMyCdId: all[0]?.myCdId ?? 0,
    lastMyCdId: all[all.length - 1]?.myCdId ?? 0,
  };
}
